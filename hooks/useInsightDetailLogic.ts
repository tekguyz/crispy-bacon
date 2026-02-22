import { useState, useEffect, useCallback, useMemo } from 'react';
import { InsightContent, AppView } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAppStore } from '../store/useAppStore';
import { triggerHaptic } from '../services/hapticService';
import { queryClient } from '../lib/queryClient';

export const useInsightDetailLogic = (insight: InsightContent | null) => {
  const { view, setSelectedInsight, clearChat } = useAppStore();
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  
  // UX Improvement: Default to 'chat' open on desktop, 'null' on mobile
  const [activeDrawer, setActiveDrawer] = useState<'info' | 'chat' | null>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return 'chat';
    }
    return null;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-open chat if expanding to desktop and nothing is open
      if (!mobile && !activeDrawer) {
        setActiveDrawer('chat');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeDrawer]);

  const handleBack = useCallback(() => { setSelectedInsight(null); clearChat(); }, [setSelectedInsight, clearChat]);
  
  const toggleDrawer = useCallback((tab: 'info' | 'chat') => { 
    setActiveDrawer(prev => prev === tab ? null : tab); 
    triggerHaptic('light'); 
  }, []);

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
        (payload: any) => {
          const newMetadata = payload.new.metadata;
          
          // Update React Query cache
          queryClient.setQueryData(['insights', insight.user_id], (oldData: any[]) => {
             if (!oldData) return oldData;
             return oldData.map((i: any) => i.id === insight.id ? { ...i, metadata: newMetadata } : i);
          });

          useAppStore.setState(state => ({
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
  const [strategicTraceText, setStrategicTraceText] = useState('');
  
  useEffect(() => {
    if (!insight?.processed_text) {
      setStrategicTraceText('');
      return;
    }
    
    import('../services/dataTransformers').then(({ formatTranscript }) => {
      setStrategicTraceText(formatTranscript(insight.processed_text || ''));
    });
  }, [insight?.processed_text]);

  return {
    isMobile,
    activeDrawer,
    toggleDrawer,
    handleBack,
    activeTasks,
    completedTasks,
    strategicTraceText
  };
};