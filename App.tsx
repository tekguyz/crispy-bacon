
import React, { Suspense, lazy, useCallback, useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react'; 
import { AppView } from './types';
import { useAppStore } from './store/useAppStore';
import { useTheme } from './hooks/useTheme';
import { useSessionOrchestrator } from './hooks/useSessionOrchestrator';
import { usePageTitle } from './hooks/usePageTitle';

// UI components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ViewRouter from './components/layout/ViewRouter';
import SkeletonDetail from './components/features/InsightDetail/SkeletonDetail';
import LoginScreen from './components/features/LoginScreen';
import { GlobalModalManager } from './components/modals/GlobalModalManager';
import { ToastContainer } from './components/ui/Toast';
import { DataSynchronizer } from './components/DataSynchronizer';
import { GlobalChatSheet } from './components/features/dashboard/GlobalChatSheet';

// Lazy load heavy feature components
const CaptureLab = lazy(() => import('./components/features/CaptureLab'));
const InputArea = lazy(() => import('./components/features/InputArea'));
const FloatingCommandCenter = lazy(() => import('./components/features/FloatingCommandCenter').then(module => ({ default: module.FloatingCommandCenter })));

const InsightDetailView = lazy(() => import('./components/features/InsightDetailView'));
const PublicShareView = lazy(() => import('./components/features/PublicShareView'));
const TermsPage = lazy(() => import('./components/features/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./components/features/legal/PrivacyPage'));
const EthicsPage = lazy(() => import('./components/features/legal/EthicsPage'));

function App() {
  const store = useAppStore();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { isReady } = useSessionOrchestrator();
  useTheme();
  usePageTitle();

  const isDetailView = store.view === AppView.INSIGHT;
  const isPublicView = store.view === AppView.PUBLIC_SHARE;

  const resetFilters = useCallback(() => {
    store.setActiveCollectionFilterId(null);
    useAppStore.setState({ activeTagFilterIds: [] });
    store.setActiveDomainFilter(null);
    store.setSearchQuery('');
    store.setActiveSourceTypeFilter('all');
  }, [store]);

  const toggleSidebarExpansion = useCallback(() => {
    setIsSidebarExpanded(prev => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const isAuthConnecting = useMemo(() => {
    return window.location.hash.includes('access_token=') || 
           window.location.search.includes('code=');
  }, []);

  if (isPublicView && store.publicSharedInsight) {
    return (
      <div className="bg-background min-h-screen text-foreground font-sans">
        <ToastContainer />
        <Suspense fallback={<SkeletonDetail />}>
          <PublicShareView />
        </Suspense>
      </div>
    );
  }
  
  if (store.view === AppView.TERMS) return <Suspense fallback={null}><TermsPage /></Suspense>;
  if (store.view === AppView.PRIVACY) return <Suspense fallback={null}><PrivacyPage /></Suspense>;
  if (store.view === AppView.AI_ETHICS) return <Suspense fallback={null}><EthicsPage /></Suspense>;

  const shouldBlock = !isReady || (isAuthConnecting && !store.session);

  if (shouldBlock) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-6" aria-busy="true">
        <Loader2 className="animate-spin text-primary relative z-10" size={32} />
        {isAuthConnecting && (
          <div className="text-center animate-fade-in px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Connecting</p>
            <p className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">Starting secure workspace...</p>
          </div>
        )}
      </div>
    );
  }

  if (!store.session && !store.isGuest) return <LoginScreen />;

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <DataSynchronizer />
      <ToastContainer />
      <GlobalModalManager />
      <GlobalChatSheet />
      
      <Sidebar 
        isExpanded={isSidebarExpanded}
        onToggleExpansion={toggleSidebarExpansion}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onResetFilters={resetFilters} 
      />
      
      <main id="main-content" className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background w-full">
        {!isDetailView && (
          <Header 
            onOpenSidebar={toggleMobileSidebar} 
            isSidebarExpanded={isSidebarExpanded}
            onToggleSidebarExpansion={toggleSidebarExpansion}
          />
        )}

        <div className="flex-1 overflow-y-auto bg-background custom-scrollbar">
          <Suspense fallback={<SkeletonDetail />}>
            {isDetailView ? (
              <InsightDetailView />
            ) : (
              <div className="container-fluid pt-4 pb-40">
                 <ViewRouter onResetFilters={resetFilters} />
              </div>
            )}
          </Suspense>
        </div>
        
        <Suspense fallback={null}>
          <FloatingCommandCenter isSidebarOpen={isSidebarExpanded || isMobileSidebarOpen} />
          <CaptureLab />
          <InputArea />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
