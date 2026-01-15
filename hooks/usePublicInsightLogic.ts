
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAppStore } from '../store/useAppStore';
import { formatTranscript } from '../services/dataTransformers';
import { triggerHaptic } from '../services/hapticService';

export const usePublicInsightLogic = () => {
  const { publicSharedInsight: insight, toggleSharedActionItem } = useAppStore();
  const [showProcessedText, setShowProcessedText] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!insight?.slug) return;

    // Neural Realtime Link v1.4.0
    // Listening for ALL updates to the record to support live content changes
    const channel = supabase
      .channel(`public-collab-${insight.slug}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shared_links', filter: `slug=eq.${insight.slug}` },
        (payload) => {
          const store = useAppStore.getState();
          if (store.publicSharedInsight?.slug === insight.slug) {
              // Perform a full shallow merge of the new record data
              useAppStore.setState({ 
                  publicSharedInsight: { 
                      ...store.publicSharedInsight, 
                      ...payload.new
                  } 
              });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [insight?.slug]);

  const formattedTranscript = useMemo(() => 
    formatTranscript(insight?.processed_text || ''), 
  [insight?.processed_text]);

  const handleToggleTask = async (index: number) => {
    if (!insight?.is_collaborative) return;
    
    triggerHaptic('medium');
    setIsSyncing(true);
    try {
      await toggleSharedActionItem(insight.slug, index);
    } catch (err) {
      console.error("[NeuralLink] Toggle handshake failed:", err);
    } finally {
      // Small timeout to allow the DB trigger to propagate smoothly in UI
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const isCompleted = (index: number) => {
    return (insight?.completed_indices || []).includes(index);
  };

  return {
    insight,
    showProcessedText,
    setShowProcessedText,
    isSyncing,
    formattedTranscript,
    handleToggleTask,
    isCompleted
  };
};
