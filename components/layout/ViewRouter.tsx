
import React, { lazy, useMemo, Suspense } from 'react';
import { AppView, InsightContent, ContentType } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useFilteredInsights } from '../../hooks/useFilteredInsights';
import { SearchX, Inbox, Star, Sparkles, LayoutGrid, List, Layers, Trash2, Video, Globe, FileText, ChevronRight, Plus } from 'lucide-react';

// Common Components
const Dashboard = lazy(() => import('../features/Dashboard'));
import EmptyState from '../features/EmptyState';
import SkeletonCard from '../features/SkeletonCard';
import InsightCard from '../features/InsightCard';
import InsightRow from '../features/InsightRow';
import { SelectionActionBar } from '../features/feed/SelectionActionBar';
import { ActiveFiltersBar } from '../features/feed/ActiveFiltersBar';

const SettingsLazy = lazy(() => import('../features/settings/SettingsScreen'));
const HelpLazy = lazy(() => import('../features/HelpScreen'));

interface ViewRouterProps {
  onResetFilters: () => void;
}

const ViewRouter: React.FC<ViewRouterProps> = ({ onResetFilters }) => {
  const { 
    view, 
    searchQuery, 
    activeCollectionFilterId, 
    activeTagFilterIds, 
    feedViewMode,
    setFeedViewMode,
    isInitialLoading,
    activeSourceTypeFilter,
    setActiveSourceTypeFilter,
    setShowImportModal
  } = useAppStore();
  
  const filteredInsights = useFilteredInsights();

  const groupedInsights = useMemo<Record<string, InsightContent[]>>(() => {
    return filteredInsights.reduce<Record<string, InsightContent[]>>((acc, insight) => {
      const date = new Date(insight.created_at).toLocaleDateString(undefined, { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(insight);
      return acc;
    }, {} as Record<string, InsightContent[]>);
  }, [filteredInsights]);

  const renderEmptyState = () => {
    const isFiltered = searchQuery || activeCollectionFilterId || activeTagFilterIds.length > 0;
    if (isFiltered) {
      return (
        <EmptyState 
          variant="filtered" 
          icon={SearchX} 
          title="No Notes Found" 
          description="Adjust your filters or search terms." 
          action={
            <button onClick={onResetFilters} className="px-10 py-4 bg-surface-container-high border border-outline-variant/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-surface-container-highest transition-all shadow-xl active:scale-95">Reset Filters</button>
          }
        />
      );
    }
    
    switch (view) {
      case AppView.FAVORITES: 
        return <EmptyState icon={Star} title="Pinned Notes" description="Save important research here for quick access." />;
      case AppView.ARCHIVED: 
        return <EmptyState icon={Inbox} title="Archive" description="Completed projects and old notes." />;
      case AppView.TRASH:
        return <EmptyState icon={Trash2} title="Trash" description="Notes here are deleted after 30 days." />;
      default: 
        return (
          <EmptyState 
            icon={Sparkles} 
            title="Ready for notes." 
            description="Capture a meeting or add a link to start your library."
            action={
              <button 
                onClick={() => setShowImportModal(true)}
                className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
              >
                <Plus size={16} strokeWidth={3} className="shrink-0" /> Create First Note
              </button>
            }
          />
        );
    }
  };

  const showSkeleton = isInitialLoading && filteredInsights.length === 0;

  const filterModes: { id: ContentType | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: Layers },
    { id: ContentType.MEETING, label: 'Voice', icon: Video },
    { id: ContentType.URL, label: 'Web', icon: Globe },
    { id: ContentType.TEXT, label: 'Note', icon: FileText },
  ];

  switch (view) {
    case AppView.SETTINGS:
      return <SettingsLazy />;
    case AppView.HELP:
      return <HelpLazy />;
    case AppView.DASHBOARD:
      return <Dashboard />;
    case AppView.ALL:
    case AppView.FAVORITES:
    case AppView.ARCHIVED:
    case AppView.TRASH:
      return (
        <div className="animate-fade-in">
          {/* Unified Utility Header */}
          <div className="mb-12 flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
               {/* Left: Feed Filters */}
               <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-[1.5rem] p-1.5 flex shadow-inner">
                    {filterModes.map((mode) => {
                      const isActive = activeSourceTypeFilter === mode.id;
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setActiveSourceTypeFilter(mode.id)}
                          className={`flex items-center justify-center gap-2.5 px-6 md:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-primary text-on-primary shadow-xl scale-[1.03] z-10' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                        >
                          <Icon size={14} strokeWidth={isActive ? 3 : 2} className="shrink-0" />
                          <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
               </div>

               {/* Right: View Toggles & Search Context */}
               <div className="flex items-center gap-4 justify-end">
                  <div className="flex bg-surface-container-low rounded-[1.5rem] p-1.5 border border-outline-variant/10 shadow-inner h-14">
                    <button 
                      onClick={() => setFeedViewMode('grid')}
                      className={`px-5 rounded-2xl transition-all flex items-center justify-center ${feedViewMode === 'grid' ? 'bg-background text-primary shadow-lg ring-1 ring-black/5' : 'text-on-surface-variant/30 hover:text-on-surface'}`}
                      aria-label="Grid View"
                    >
                      <LayoutGrid size={18} strokeWidth={3} className="shrink-0" />
                    </button>
                    <button 
                      onClick={() => setFeedViewMode('list')}
                      className={`px-5 rounded-2xl transition-all flex items-center justify-center ${feedViewMode === 'list' ? 'bg-background text-primary shadow-lg ring-1 ring-black/5' : 'text-on-surface-variant/30 hover:text-on-surface'}`}
                      aria-label="List View"
                    >
                      <List size={18} strokeWidth={3} className="shrink-0" />
                    </button>
                  </div>
               </div>
            </div>

            <ActiveFiltersBar />
          </div>
          
          <SelectionActionBar />

          {filteredInsights.length === 0 && !showSkeleton ? renderEmptyState() : (
            <div className="space-y-16 pb-40">
              {showSkeleton && (
                <div className={feedViewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              )}
              {(Object.entries(groupedInsights) as [string, InsightContent[]][]).map(([date, items]) => (
                <section key={date} className="space-y-8 animate-hydrate">
                  <div className="flex items-center gap-4 py-2 border-b border-outline-variant/10">
                    <ChevronRight size={14} className="text-primary opacity-40 shrink-0" strokeWidth={4} />
                    <h3 className="text-[11px] font-black text-on-surface uppercase tracking-[0.4em] leading-none">{date}</h3>
                    <div className="h-px flex-1 bg-outline-variant/10" />
                    <span className="text-[9px] font-mono font-black text-on-surface-variant opacity-20 uppercase">{items.length} ITEMS</span>
                  </div>
                  
                  {feedViewMode === 'grid' ? (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {items.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col border-2 border-outline-variant/10 rounded-[2.5rem] overflow-hidden bg-surface-container-lowest shadow-m3-1">
                      {items.map((insight) => (
                        <InsightRow key={insight.id} insight={insight} />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      );
    default:
      return <Dashboard />;
  }
};

export default ViewRouter;
