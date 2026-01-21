
import { StateCreator } from 'zustand';
import { AppState, IntelligenceSlice } from './types';
import { ContentType, ProcessingStatus, InsightTemplate } from '../types';
import { supabase } from '../services/supabaseClient';
import { analyzeContent } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { blobToBase64, cleanPayload, getEffectiveMimeType } from '../utils/signalUtils';
import { getArtifactLocally, saveArtifactLocally, SyncStatus } from '../services/localDbService';
import { archiveRefinement, uploadSignalAudio } from '../services/processingService';

export const createProcessingSlice: StateCreator<AppState, [], [], Partial<IntelligenceSlice>> = (set, get) => ({
  activeProcessCount: 0,

  retryProcessing: async (insight) => {
    const { session, userProfile, fetchData, addToast, personaStyle } = get();
    if (!session) return addToast("Sign in required.", "info");

    set(s => ({ activeProcessCount: s.activeProcessCount + 1, isProcessing: true }));
    try {
      let audioBase64 = "";
      let mimeType = insight.metadata?.mimeType || 'audio/webm';

      if (insight.type === ContentType.MEETING) {
        // Priority 1: Local Artifact (Freshest, no network latency)
        const local = await getArtifactLocally(insight.id);
        if (local?.blob) {
            audioBase64 = await blobToBase64(local.blob);
            mimeType = local.type;
        } 
        // Priority 2: Re-download from Cloud
        else if (insight.metadata?.audioUrl) {
            const resp = await fetch(insight.metadata.audioUrl);
            const blob = await resp.blob();
            audioBase64 = await blobToBase64(blob);
            mimeType = blob.type;
        }
      }

      // Ensure we have a valid MIME type for Gemini
      const effectiveMime = getEffectiveMimeType(mimeType, insight.metadata?.originalName);

      const recap = await analyzeContent(
        insight.original_content || "", 
        insight.type, 
        insight.metadata?.customIntent || '', 
        insight.metadata?.template || get().preferredTemplate,
        !!userProfile?.is_pro, 
        personaStyle, 
        audioBase64 || undefined,
        effectiveMime, 
        insight.metadata?.durationSeconds
      );
      
      await archiveRefinement(insight.id, session.user.id, recap, insight.metadata);
      await fetchData();
      addToast("Note updated.", "success");

    } catch (e: any) { 
        console.error(e);
        addToast("Retry failed. Check file compatibility.", "error"); 
    }
    finally { set(s => ({ activeProcessCount: Math.max(0, s.activeProcessCount - 1), isProcessing: s.activeProcessCount > 1 })); }
  },

  processContent: async (input, type, options: { template?: InsightTemplate, refUrl?: string, autoOpen?: boolean } = {}) => {
    const { userProfile, session, addToast, fetchData, personaStyle, fetchSingleInsight, setSelectedInsight } = get();
    const itemId = uuidv4();
    
    set(s => ({ isProcessing: true, activeProcessCount: s.activeProcessCount + 1 }));
    if (!session) return addToast("Note saved to device.", "success");

    try {
      await supabase.from('insights').insert([{ id: itemId, user_id: session.user.id, source_type: type, processing_status: ProcessingStatus.PROCESSING }]);
      const recap = await analyzeContent(input, type, get().currentIntent || '', options.template || get().preferredTemplate, !!userProfile?.is_pro, personaStyle);
      await archiveRefinement(itemId, session.user.id, recap, { template: options.template });
      
      await fetchData();

      if (options.autoOpen) {
        // Pinpoint the new insight to ensure it's selected with fresh data
        await fetchSingleInsight(itemId);
        const freshItem = get().insights.find(i => i.id === itemId);
        if (freshItem) {
          setSelectedInsight(freshItem);
        }
      }
    } catch (e: any) { addToast(e.message, "error"); }
    finally { set(s => ({ isProcessing: false, activeProcessCount: 0 })); }
  },

  processMeeting: async (audioBlob, manualNotes, options: { template?: InsightTemplate, refUrl?: string, durationSeconds?: number, intent?: string, autoOpen?: boolean } = {}) => {
    const { userProfile, session, addToast, fetchData, personaStyle, fetchSingleInsight, setSelectedInsight } = get();
    const itemId = uuidv4();
    
    set(s => ({ isProcessing: true, activeProcessCount: s.activeProcessCount + 1, showCaptureLab: false }));
    const localArtifact = { id: itemId, blob: audioBlob, type: audioBlob.type, timestamp: Date.now(), sync_status: SyncStatus.UNSYNCED };
    await saveArtifactLocally(localArtifact);

    if (!session) return;
    
    try {
      const path = await uploadSignalAudio(userProfile!.id, itemId, audioBlob);
      
      // Clean initial payload to prevent 400s
      const initialPayload = cleanPayload({ 
          id: itemId, 
          user_id: userProfile!.id, 
          source_type: ContentType.MEETING, 
          storage_path: path, 
          processing_status: ProcessingStatus.PROCESSING,
          title: "Analyzing...", // Placeholder title
          metadata: { originalName: (audioBlob as any).name } 
      });

      await supabase.from('insights').insert([initialPayload]);
      
      const audioBase64 = await blobToBase64(audioBlob);
      const effectiveMime = getEffectiveMimeType(audioBlob.type, (audioBlob as any).name);

      const recap = await analyzeContent(
          "", 
          ContentType.MEETING, 
          manualNotes, 
          options.template || get().preferredTemplate, 
          !!userProfile?.is_pro, 
          personaStyle, 
          audioBase64, 
          effectiveMime, 
          options.durationSeconds
      );
      
      await archiveRefinement(itemId, session.user.id, recap, { 
          durationSeconds: options.durationSeconds, 
          template: options.template,
          mimeType: effectiveMime,
          originalName: (audioBlob as any).name
      });
      
      await saveArtifactLocally({ ...localArtifact, sync_status: SyncStatus.SYNCED });
      await fetchData();

      if (options.autoOpen) {
        await fetchSingleInsight(itemId);
        const freshItem = get().insights.find(i => i.id === itemId);
        if (freshItem) {
          setSelectedInsight(freshItem);
        }
      }
    } catch (e: any) { 
        console.error("Processing Error:", e);
        addToast("Could not summarize. Audio saved.", "error"); 
    }
    finally { set(s => ({ isProcessing: false, activeProcessCount: 0 })); }
  }
});
