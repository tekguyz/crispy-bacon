
import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { supabase } from '../services/supabaseClient';
import { mapSupabaseToInsight } from '../services/dataTransformers';
import { createDataItemSlice } from './dataItemSlice';
import { createDataTaxonomySlice } from './dataTaxonomySlice';
import { createDataCollabSlice } from './dataCollabSlice';
import { ProcessingStatus, ContentType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getAllLocalArtifacts, deleteArtifactLocally, saveArtifactLocally, SyncStatus } from '../services/localDbService';
import { queryClient } from '../lib/queryClient';
import { getCalendarEvents, listDriveFiles, downloadDriveFile } from '../services/googleBridge';
import { cleanPayload } from '../utils/dataUtils';

export const createDataSlice: StateCreator<AppState, [], [], DataSlice> = (set, get, ...rest) => ({
  publicSharedInsight: null,
  isInitialLoading: true,

  fetchData: async () => {
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  },

  fetchSingleInsight: async (id: string) => {
    const { isSupabaseActive, session, hydrateAudio } = get();
    if (!isSupabaseActive || !session?.user) return;

    try {
      const { data, error } = await supabase
        .from('insights')
        .select(`*, summaries(*), insight_collections(collections(*)), insight_tags(tags(*))`)
        .eq('id', id)
        .single();

      if (error || !data) return;

      const mapped = mapSupabaseToInsight(data);
      
      set({ selectedInsight: mapped });
      
      // Update cache
      queryClient.setQueryData(['insights', session.user.id], (oldData: any[]) => {
         if (!oldData) return [mapped];
         return oldData.map(i => i.id === id ? mapped : i);
      });

      if (mapped.processing_status === ProcessingStatus.COMPLETED && get().selectedInsight?.id === id) {
        hydrateAudio(mapped);
      }
    } catch (e) {
        console.error(`[Hydration] Failed to fetch data for ${id}`, e);
    }
  },

  syncLocalQueue: async (force = false) => {
    const { session, userProfile, updateStorageUsage } = get();
    if (!session?.user || !userProfile) return;
    
    const pending = await getAllLocalArtifacts(true, SyncStatus.UNSYNCED);
    if (pending.length === 0) return;
    
    console.log(`[Bridge] 📤 Syncing ${pending.length} unsynced local nodes...`);
    
    const now = new Date().toISOString();
    for (const art of pending) {
        if (!art.blob) continue;
        const path = `${session.user.id}/${art.id}.webm`;
        try {
            await supabase.storage.from('meetings').upload(path, art.blob, { upsert: true });
            
            // Clean payload to prevent 400 Bad Request on legacy items
            const meta = cleanPayload({ ...art.metadata.options, version: art.version });
            const payload = cleanPayload({
                id: art.id, 
                user_id: session.user.id, 
                title: art.metadata.title || "Cloud Sync Note", 
                source_type: ContentType.MEETING, 
                storage_path: path, 
                processing_status: ProcessingStatus.PENDING, 
                metadata: meta,
                updated_at: now
            });

            await supabase.from('insights').upsert(payload);
            await saveArtifactLocally({ ...art, sync_status: SyncStatus.SYNCED });
        } catch (e: any) {
            console.error(`[Bridge] ❌ Node sync failed: ${art.id}`, e.message);
        }
    }
    updateStorageUsage();
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  },

  clearLocalCache: async () => {
    const { addToast, updateStorageUsage } = get();
    try {
        const localArtifacts = await getAllLocalArtifacts(false);
        for (const art of localArtifacts) await deleteArtifactLocally(art.id);
        await updateStorageUsage();
        addToast("Cache cleared.", "success");
        queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) { addToast("Clear failed.", "error"); }
  },

  importDriveFiles: async (files, options) => {
    const { addToast, session, analyzeContent, analyzeMeeting, logSystemEvent, ensureValidProviderToken } = get();
    if (!(await ensureValidProviderToken()) || !session || files.length === 0) return;

    const filesToProcess = files.length > 5 ? files.slice(0, 5) : files;
    if (files.length > 5) addToast("Premium limit: Processing 5 files at once.", "warn");

    logSystemEvent(`[IMPORT] Bulk import: ${filesToProcess.length} items.`);
    addToast(`Importing ${filesToProcess.length} files...`, "info");

    const accessToken = (session as any).provider_token;

    for (const file of filesToProcess) {
      try {
        await new Promise(r => setTimeout(r, 250));
        
        // Use Bridge for download
        const content = await downloadDriveFile(file.id, accessToken, file.mimeType);

        if (content instanceof Blob) {
           analyzeMeeting(content, `Cloud Import: ${file.name}`, { template: options.template } as any);
        } else if (typeof content === 'string' && content.length > 0) {
           analyzeContent(content, ContentType.TEXT, { template: options.template });
        }
      } catch (err: any) {
        logSystemEvent(`[IMPORT_FAILED] Individual file error: ${file.name} - ${err.message}`, "error");
      }
    }
    
    addToast("Files added.", "success");
  },

  recoverOrphanedFiles: async () => {
    const { session } = get();
    if (!session?.user) return;
    try {
      const { data: files } = await supabase.storage.from('meetings').list(session.user.id);
      const { data: dbItems } = await supabase.from('insights').select('id, storage_path').eq('user_id', session.user.id);
      const knownPaths = new Set(dbItems?.map(i => i.storage_path) || []);
      const orphans = (files || []).filter(f => !knownPaths.has(`${session.user.id}/${f.name}`));
      for (const orphan of orphans) {
        const now = new Date().toISOString();
        await supabase.from('insights').insert({
          id: uuidv4(), user_id: session.user.id, title: `Recovered: ${orphan.name}`,
          source_type: ContentType.MEETING, storage_path: `${session.user.id}/${orphan.name}`,
          processing_status: ProcessingStatus.FAILED, error_message: "Restored.", created_at: orphan.created_at, updated_at: now
        });
      }
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (err: any) {}
  },

  ...createDataItemSlice(set, get, ...rest),
  ...createDataTaxonomySlice(set, get, ...rest),
  ...createDataCollabSlice(set, get, ...rest),
} as DataSlice);
