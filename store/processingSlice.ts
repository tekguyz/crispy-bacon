
import { StateCreator } from 'zustand';
import { AppState, AssistantSlice } from './types';
import { ContentType, ProcessingStatus, InsightTemplate } from '../types';
import { supabase } from '../services/supabaseClient';
import { analyzeContent as analyzeGeminiContent } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { blobToBase64, cleanPayload, getEffectiveMimeType } from '../utils/dataUtils';
import { getArtifactLocally, saveArtifactLocally, SyncStatus } from '../services/localDbService';
import { archiveRefinement, uploadMeetingAudio } from '../services/processingService';
import { queryClient } from '../lib/queryClient';

export const createProcessingSlice: StateCreator<AppState, [], [], Partial<AssistantSlice>> = (set, get) => ({
  activeAnalysisCount: 0,

  retryAnalysis: async (insight) => {
    const { session, userProfile, addToast, personaStyle } = get();
    if (!session) return addToast("Sign in required.", "info");

    set(s => ({ activeAnalysisCount: s.activeAnalysisCount + 1, isAnalyzing: true }));
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

      const recap = await analyzeGeminiContent(
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
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      addToast("Note updated.", "success");

    } catch (e: any) { 
        console.error(e);
        addToast("Retry failed. Check file compatibility.", "error"); 
    }
    finally { set(s => ({ activeAnalysisCount: Math.max(0, s.activeAnalysisCount - 1), isAnalyzing: s.activeAnalysisCount > 1 })); }
  },

  analyzeContent: async (input, type, options: { template?: InsightTemplate, refUrl?: string, autoOpen?: boolean } = {}) => {
    const { userProfile, session, addToast, personaStyle, fetchSingleInsight, setSelectedInsight } = get();
    const itemId = uuidv4();
    
    set(s => ({ isAnalyzing: true, activeAnalysisCount: s.activeAnalysisCount + 1 }));
    if (!session) return addToast("Note saved to device.", "success");

    try {
      await supabase.from('insights').insert([{ id: itemId, user_id: session.user.id, source_type: type, processing_status: ProcessingStatus.PROCESSING }]);
      const recap = await analyzeGeminiContent(input, type, get().currentIntent || '', options.template || get().preferredTemplate, !!userProfile?.is_pro, personaStyle);
      await archiveRefinement(itemId, session.user.id, recap, { template: options.template });
      
      queryClient.invalidateQueries({ queryKey: ['insights'] });

      if (options.autoOpen) {
        // Pinpoint the new insight to ensure it's selected with fresh data
        await fetchSingleInsight(itemId);
        // We can't get it from store anymore, so we rely on fetchSingleInsight setting selectedInsight
      }
    } catch (e: any) { addToast(e.message, "error"); }
    finally { set(s => ({ isAnalyzing: false, activeAnalysisCount: 0 })); }
  },

  analyzeMeeting: async (audioBlob, manualNotes, options: { template?: InsightTemplate, refUrl?: string, durationSeconds?: number, intent?: string, autoOpen?: boolean } = {}) => {
    const { userProfile, session, addToast, personaStyle, fetchSingleInsight, setSelectedInsight } = get();
    const itemId = uuidv4();
    
    set(s => ({ isAnalyzing: true, activeAnalysisCount: s.activeAnalysisCount + 1, showRecorder: false }));
    const localArtifact = { id: itemId, blob: audioBlob, type: audioBlob.type, timestamp: Date.now(), sync_status: SyncStatus.UNSYNCED };
    await saveArtifactLocally(localArtifact);

    if (!session) return;
    
    try {
      const path = await uploadMeetingAudio(userProfile!.id, itemId, audioBlob);
      
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

      const recap = await analyzeGeminiContent(
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
      queryClient.invalidateQueries({ queryKey: ['insights'] });

      if (options.autoOpen) {
        await fetchSingleInsight(itemId);
        // We can't get it from store anymore, so we rely on fetchSingleInsight setting selectedInsight
      }
    } catch (e: any) { 
        console.error("Processing Error:", e);
        addToast("Could not summarize. Audio saved.", "error"); 
    }
    finally { set(s => ({ isAnalyzing: false, activeAnalysisCount: 0 })); }
  }
});
