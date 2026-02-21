
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AppView, ProcessingStatus, InsightContent } from '../types';
import { triggerHaptic } from '../services/hapticService';

export const useInsightDetailViewLogic = () => {
  const { 
    selectedInsight: insight, 
    setSelectedInsight,
    clearChat, 
    view,
    userProfile 
  } = useAppStore();

  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  
  const isSideSheet = view === AppView.DASHBOARD;

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

  const handleBack = useCallback(() => { 
    setSelectedInsight(null); 
    clearChat(); 
  }, [setSelectedInsight, clearChat]);
  
  const toggleDrawer = useCallback((tab: 'info' | 'chat') => { 
    setActiveDrawer(prev => prev === tab ? null : tab); 
    triggerHaptic('light'); 
  }, []);

  const isLocked = useMemo(() => {
    if (!insight) return false;
    return !userProfile?.is_pro && (Date.now() - new Date(insight.created_at).getTime() > 7 * 24 * 60 * 60 * 1000);
  }, [insight, userProfile]);

  const isLocal = insight?.processing_status === ProcessingStatus.LOCAL;
  const isProcessing = insight?.processing_status === ProcessingStatus.PENDING || insight?.processing_status === ProcessingStatus.PROCESSING;
  const isFailed = insight?.processing_status === ProcessingStatus.FAILED;

  return {
    insight,
    isMobile,
    isSideSheet,
    activeDrawer,
    setActiveDrawer,
    handleBack,
    toggleDrawer,
    isLocked,
    isLocal,
    isProcessing,
    isFailed
  };
};
