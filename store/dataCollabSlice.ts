
import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase, handleSupabaseError } from '../services/supabaseClient';
import { AppView, ContentType, ProcessingStatus } from '../types';
import { queryClient } from '../lib/queryClient';

export const createDataCollabSlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  fetchPublicInsight: async (slug) => {
    const { addToast, session } = get();
    const { data, error } = await supabase.from('shared_links').select('*').eq('slug', slug).single();
    
    if (error || !data) {
      set({ publicSharedInsight: null });
      handleSupabaseError(error || { message: "Link not found" }, addToast, 'Link invalid or expired.');
      return;
    }

    // TRAFFIC CONTROL:
    // 1. If Logged In -> Convert to App Object -> Redirect to Detail View
    if (session?.user) {
        const mappedInsight = {
            id: data.insight_id, 
            user_id: data.user_id,
            title: data.title,
            created_at: data.created_at,
            summary: data.summary,
            highlights: data.highlights,
            action_items: data.action_items,
            processed_text: data.processed_text,
            original_content: "", 
            source_type: ContentType.TEXT,
            type: ContentType.TEXT,
            sentiment: data.sentiment,
            site_name: data.site_name,
            processing_status: ProcessingStatus.COMPLETED,
            is_favorite: false,
            is_archived: false,
            metadata: { 
                isSharedPreview: true,
                audioUrl: data.audio_url,
                readingTimeMinutes: 1,
                completedActionIndices: data.completed_indices
            }
        };

        set({ 
            selectedInsight: mappedInsight as any,
            view: AppView.INSIGHT 
        });
        
        addToast("Opening shared note...", "info");
    } 
    // 2. If Guest -> Show Public Flyer
    else {
        set({ 
            publicSharedInsight: data, 
            view: AppView.PUBLIC_SHARE 
        });
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
    
    const { trackEvent } = await import('../services/analyticsService');
    trackEvent('share_link_created', { is_collaborative: options.isCollaborative });
    return `${window.location.origin}?share=${slug}`;
  },

  toggleSharedActionItem: async () => {
    console.warn("Guest interaction disabled in Preview Protocol.");
  },

  importSharedInsight: async (shared) => {
    const { session, addToast, setView } = get();
    if (!session?.user) return;

    try {
        const insightId = uuidv4();
        const { error: itemError } = await supabase.from('insights').insert([{
            id: insightId,
            user_id: session.user.id,
            title: shared.title,
            source_type: ContentType.TEXT,
            processing_status: ProcessingStatus.COMPLETED,
            processed_text: shared.processed_text,
            site_name: shared.site_name,
            metadata: { 
                importedFrom: shared.slug, 
                audioUrl: shared.audio_url,
                version: 1 
            }
        }]);

        if (itemError) throw itemError;

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

        await queryClient.invalidateQueries({ queryKey: ['insights', session.user.id] });
        addToast("Note secured in library.", "success");
        set({ publicSharedInsight: null });
        get().fetchSingleInsight(insightId);
        set({ view: AppView.INSIGHT });
    } catch (err: any) {
        addToast("Link claim failed.", "error");
    }
  }
});
