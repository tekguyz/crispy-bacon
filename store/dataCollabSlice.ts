
import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase, handleSupabaseError } from '../services/supabaseClient';
import { trackEvent } from '../services/analyticsService';
import { AppView, ContentType, ProcessingStatus } from '../types';
import { queryClient } from '../lib/queryClient';

export const createDataCollabSlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  fetchPublicInsight: async (slug) => {
    const { addToast } = get();
    const { data, error } = await supabase.from('shared_links').select('*').eq('slug', slug).single();
    if (error) {
      set({ publicSharedInsight: null });
      handleSupabaseError(error, addToast, 'Link invalid or expired.');
    } else {
      set({ publicSharedInsight: data, view: AppView.PUBLIC_SHARE });
    }
  },

  createShareLink: async (insight, options) => {
    const { session, isSupabaseActive, addToast } = get();
    if (!isSupabaseActive || !session?.user) throw new Error("Authentication required.");
    
    const slug = uuidv4().substring(0, 12);
    const expires_at = options.expiresHours ? new Date(Date.now() + options.expiresHours * 60 * 60 * 1000).toISOString() : null;
    
    let publicAudioUrl = null;
    if (options.includeAudio && insight.storage_path) {
        const expirySeconds = options.expiresHours ? (options.expiresHours * 3600) + 3600 : 31536000;
        const { data } = await supabase.storage.from('meetings').createSignedUrl(insight.storage_path, expirySeconds);
        publicAudioUrl = data?.signedUrl;
    }

    const payload = {
      slug, 
      insight_id: insight.id, 
      user_id: session.user.id, 
      title: insight.title || 'Untitled',
      summary: insight.summary || '', 
      highlights: insight.highlights || [], 
      action_items: insight.action_items || [],
      processed_text: typeof insight.processed_text === 'string' ? insight.processed_text : JSON.stringify(insight.processed_text || ''), 
      audio_url: publicAudioUrl,
      sentiment: insight.sentiment || 'NEUTRAL', 
      site_name: insight.site_name || 'Bacon Insight',
      is_collaborative: !!options.isCollaborative, 
      completed_indices: insight.metadata?.completedActionIndices || [],
      expires_at,
      version: (insight.metadata?.version || 0) + 1 
    };
    
    const { error } = await supabase.from('shared_links').insert([payload]);
    if (error) {
        handleSupabaseError(error, addToast, "Collaboration sync failed.");
        throw error;
    }
    
    trackEvent('share_link_created', { is_collaborative: options.isCollaborative });
    return `${window.location.origin}?share=${slug}`;
  },

  toggleSharedActionItem: async (slug, index) => {
    const { publicSharedInsight, addToast } = get();
    if (!publicSharedInsight) return;
    
    const currentCompleted = publicSharedInsight.completed_indices || [];
    const isNowCompleted = !currentCompleted.includes(index);
    const newCompleted = isNowCompleted ? [...currentCompleted, index] : currentCompleted.filter(i => i !== index);
    
    const newVersion = (publicSharedInsight.version || 0) + 1;

    set({ 
      publicSharedInsight: { 
        ...publicSharedInsight, 
        completed_indices: newCompleted,
        version: newVersion
      } 
    });
    
    try {
      const { error } = await supabase
        .from('shared_links')
        .update({ 
          completed_indices: newCompleted,
          version: newVersion
        })
        .eq('slug', slug)
        .eq('is_collaborative', true);

      if (error) throw error;
      
    } catch (error: any) {
      console.error("[Workspace] Collaboration update failed:", error.message);
      handleSupabaseError(error, addToast, "Update failed: Link may be read-only.");
      set({ publicSharedInsight: { ...publicSharedInsight, completed_indices: currentCompleted } });
    }
  },

  importSharedInsight: async (shared) => {
    const { session, addToast, setView } = get();
    if (!session?.user) {
        addToast("Authentication required to save notes.", "info");
        return;
    }

    try {
        const insightId = uuidv4();
        
        // 1. Create the primary insight record
        const { error: itemError } = await supabase.from('insights').insert([{
            id: insightId,
            user_id: session.user.id,
            title: shared.title,
            source_type: ContentType.TEXT,
            processing_status: ProcessingStatus.COMPLETED,
            processed_text: shared.processed_text,
            site_name: shared.site_name,
            metadata: { importedFrom: shared.slug, version: 1 }
        }]);

        if (itemError) throw itemError;

        // 2. Insert the associated intelligence summary
        // CRITICAL: Must include user_id on the summary for RLS to allow the insert
        const { error: summaryError } = await supabase.from('summaries').insert([{
            insight_id: insightId,
            user_id: session.user.id,
            summary: shared.summary,
            highlights: shared.highlights,
            action_items: shared.action_items,
            sentiment: shared.sentiment,
            reading_time: 1
        }]);

        if (summaryError) throw summaryError;

        // 3. Invalidate Query Cache and Navigate
        await queryClient.invalidateQueries({ queryKey: ['insights', session.user.id] });
        
        addToast("Note secured in library.", "success");
        set({ publicSharedInsight: null });
        setView(AppView.DASHBOARD);
        
    } catch (err: any) {
        console.error("[Bridge] Import failed:", err);
        addToast("Link claim failed. Note may be expired.", "error");
    }
  }
});
