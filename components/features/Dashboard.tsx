
import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { DashboardHistory } from './dashboard/DashboardHistory';
import { DashboardTasks } from './dashboard/DashboardTasks';
import { SideSheet } from '../ui/SideSheet';
import { InsightContent } from '../../types';
import { LayoutGrid, Zap, Mic, Globe, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../services/hapticService';

// Performance: Lazy load the heavy detail view for Dashboard previews
const InsightDetailView = lazy(() => import('./InsightDetailView'));

const Dashboard: React.FC = () => {
  const { 
    userProfile, fetchCalendarMeetings, isInitialLoading, insights,
    clearChat, setShowCaptureLab, setShowInputModal, session
  } = useAppStore();

  const { stats, activeTasks } = useDashboardStats();
  const isPro = !!userProfile?.is_pro;
  const hasCalendarAccess = !!(session as any)?.provider_token;
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewInsight, setPreviewInsight] = useState<InsightContent | null>(null);

  useEffect(() => {
    if (hasCalendarAccess && isPro) {
      fetchCalendarMeetings();
    }
  }, [hasCalendarAccess, isPro, fetchCalendarMeetings]);

  const handleOpenPreview = (insight: InsightContent) => {
    setPreviewInsight(insight);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewInsight(null);
    clearChat();
  };

  const activeInsights = useMemo(() => 
    insights.filter(i => !i.deleted_at && !i.is_archived), 
  [insights]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const displayName = useMemo(() => {
    const metadata = session?.user?.user_metadata || {};
    const fullName = userProfile?.full_name || metadata.full_name || metadata.name;
    return fullName?.split(' ')[0] || 'Strategist';
  }, [userProfile, session]);

  return (
    <div className="relative min-h-full w-full">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" aria-hidden="true" />
      
      <div className="relative z-10 animate-fade-in w-full">
        <div className="container-fluid pt-4 pb-40 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-4xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
               <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
               <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     <span className="text-[9px] font-mono font-black uppercase tracking-widest text-success">Online</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-on-surface leading-[0.95] tracking-tight">
                    {greeting}, <span className="text-primary italic">{displayName}.</span>
                  </h1>
                  <p className="text-[11px] font-bold text-on-surface-variant opacity-60 max-w-md mt-2 leading-relaxed">
                    Your library is secure. {stats.actionItemCount} pending decisions detected across {activeInsights.length} notes.
                  </p>
               </div>

               <div className="relative z-10 flex gap-3 mt-8">
                  <button 
                    onClick={() => { triggerHaptic('medium'); setShowCaptureLab(true); }}
                    className="flex items-center gap-3 px-6 h-12 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg interactive"
                  >
                    <Mic size={14} strokeWidth={3} /> Record Note
                  </button>
                  <button 
                    onClick={() => { triggerHaptic('light'); setShowInputModal(true); }}
                    className="flex items-center gap-3 px-6 h-12 bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-black text-[10px] uppercase tracking-[0.2em] interactive hover:bg-surface-container-highest"
                  >
                    <Globe size={14} strokeWidth={3} /> Import
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
               <div className="bg-surface-container-low p-4 md:p-5 rounded-3xl border border-outline-variant shadow-sm flex items-center justify-between interactive group">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Library</span>
                     <p className="text-2xl md:text-3xl font-mono font-black text-on-surface leading-none">{activeInsights.length}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                     <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                  </div>
               </div>
               <div className="bg-surface-container-low p-4 md:p-5 rounded-3xl border border-outline-variant shadow-sm flex items-center justify-between interactive group">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Decisions</span>
                     <p className="text-2xl md:text-3xl font-mono font-black text-on-surface leading-none">{stats.actionItemCount}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                     <Zap className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            <div className="lg:col-span-8">
              <DashboardHistory 
                insights={activeInsights} 
                isLoading={isInitialLoading} 
                onSelectInsight={handleOpenPreview}
              />
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <DashboardTasks 
                activeTasks={activeTasks} 
                isLoading={isInitialLoading} 
                onSelectInsight={handleOpenPreview}
              />
            </aside>
          </div>
        </div>
      </div>

      <SideSheet 
        isOpen={isPreviewOpen} 
        onClose={handleClosePreview}
        title={previewInsight?.title || 'Research Note'}
      >
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary opacity-20" size={32} />
          </div>
        }>
          {previewInsight && (
              <div className="h-full bg-background">
                  <DetailPreviewWrapper insight={previewInsight} />
              </div>
          )}
        </Suspense>
      </SideSheet>
    </div>
  );
};

const DetailPreviewWrapper = ({ insight }: { insight: InsightContent }) => {
    useEffect(() => {
        useAppStore.setState({ selectedInsight: insight });
        return () => useAppStore.setState({ selectedInsight: null });
    }, [insight]);

    return <InsightDetailView />;
};

export default Dashboard;
