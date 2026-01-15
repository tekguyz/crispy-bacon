import { useEffect, useMemo } from 'react';
import { InsightContent } from '../types';
import { formatTranscript } from '../services/dataTransformers';
import { supabase } from '../services/supabaseClient';
import { useAppStore } from '../store/useAppStore';

export const useInsightDetailLogic = (insight: InsightContent | null) => {
  
  // Realtime Sync: Listen for changes to the specific insight node
  useEffect(() => {
    if (!insight) return;

    const channel = supabase
      .channel(`owner-sync-${insight.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'insights', 
          filter: `id=eq.${insight.id}` 
        },
        (payload) => {
          const newMetadata = payload.new.metadata;
          
          useAppStore.setState(state => ({
            insights: state.insights.map(i => 
              i.id === insight.id ? { ...i, metadata: newMetadata } : i
            ),
            selectedInsight: state.selectedInsight?.id === insight.id 
              ? { ...state.selectedInsight, metadata: newMetadata } 
              : state.selectedInsight
          }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [insight?.id]);

  const { activeTasks, completedTasks } = useMemo(() => {
    if (!insight) return { activeTasks: [], completedTasks: [] };
    
    const items = Array.isArray(insight.action_items) ? insight.action_items : [];
    const completedIndices = Array.isArray(insight.metadata?.completedActionIndices) 
      ? insight.metadata.completedActionIndices 
      : [];
    
    const all = items.map((item, index) => ({ item, index }));
    
    return { 
      activeTasks: all.filter(t => !completedIndices.includes(t.index)), 
      completedTasks: all.filter(t => completedIndices.includes(t.index)) 
    };
  }, [insight, insight?.metadata?.completedActionIndices, insight?.action_items]);

  /**
   * v1.3.1 Strategic Trace Protocol:
   * Maps 'insights.processed_text' to the detailed summary layer.
   */
  const strategicTraceText = useMemo(() => 
    formatTranscript(insight?.processed_text || ''), 
  [insight?.processed_text]);

  return {
    activeTasks,
    completedTasks,
    strategicTraceText
  };
};