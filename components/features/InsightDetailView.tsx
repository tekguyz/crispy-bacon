
import React, { useState, useCallback, useEffect } from 'react';
import { X, MessageSquare, Info, CloudUpload, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useInsightDetailLogic } from '../../hooks/useInsightDetailLogic';
import { useInsightDetailViewLogic } from '../../hooks/useInsightDetailViewLogic';
import { triggerHaptic } from '../../services/hapticService';
import LiveAssistantSession from './LiveAssistantSession';
import DetailHeader from './InsightDetail/DetailHeader';
import { FailedState, ProcessingState } from './InsightDetail/StatusViews';
import InfoDrawer from './InsightDetail/InfoDrawer';
import ChatDrawer from './InsightDetail/ChatDrawer';
import { InsightContentBody } from './InsightDetail/InsightContentBody';
import { LockedView } from './InsightDetail/LockedView';
import { ProcessingStatus, AppView } from '../../types';
import { GeminiLiveIcon } from '../ui/Logo';

const InsightDetailView: React.FC = () => {
  const { 
    startLiveAssistant, isLiveAssistantActive,
    setShowShareModal, setShowUpgradeModal, retryAnalysis,
    userProfile
  } = useAppStore();

  const {
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
  } = useInsightDetailViewLogic();

  const { activeTasks, completedTasks } = useInsightDetailLogic(insight);

  if (!insight) return null;
  if (isLocked) return <LockedView />;

  return (
    <div className={`flex flex-col h-full bg-background animate-fade-in relative overflow-hidden ${isSideSheet ? 'rounded-l-expressive' : ''}`}>
      <LiveAssistantSession />
      
      {!isSideSheet && (
        <DetailHeader 
            title={insight.title} sentiment={insight.sentiment} siteName={insight.site_name} isPro={!!userProfile?.is_pro}
            isLiveAssistantActive={!!isLiveAssistantActive} activeDrawer={activeDrawer} onBack={handleBack}
            onShare={() => setShowShareModal(true)} onToggleDrawer={toggleDrawer}
            onStartLive={() => startLiveAssistant(insight)} onUpgrade={() => setShowUpgradeModal(true)}
        />
      )}

      {isSideSheet && (
         <div className="h-14 flex items-center justify-between px-6 border-b border-outline-variant/10 bg-surface-container-low shrink-0 overflow-x-auto no-scrollbar gap-4">
            <div className="flex items-center gap-1.5">
               <button 
                  onClick={() => toggleDrawer('chat')}
                  className={`flex items-center gap-2 px-3 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeDrawer === 'chat' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-primary hover:bg-on-surface/5'}`}
               >
                  <MessageSquare size={14} strokeWidth={activeDrawer === 'chat' ? 3 : 2} />
                  <span>Chat</span>
               </button>
               <button 
                  onClick={() => toggleDrawer('info')}
                  className={`flex items-center gap-2 px-3 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeDrawer === 'info' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-primary hover:bg-on-surface/5'}`}
               >
                  <Layers size={14} strokeWidth={activeDrawer === 'info' ? 3 : 2} />
                  <span>Info</span>
               </button>
            </div>

            <button 
                onClick={() => { triggerHaptic('medium'); !!userProfile?.is_pro ? startLiveAssistant(insight) : setShowUpgradeModal(true); }}
                className={`flex items-center gap-2.5 px-4 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLiveAssistantActive ? 'bg-primary text-on-primary shadow-lg animate-spring-scale' : 'bg-background border border-outline-variant/10 text-on-surface shadow-sm hover:border-primary/30'}`}
            >
                <GeminiLiveIcon className={`w-4 h-4 ${isLiveAssistantActive ? 'animate-pulse' : ''}`} />
                <span>Voice</span>
            </button>
         </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${activeDrawer && !isMobile && !isSideSheet ? 'pr-[400px]' : ''}`}>
            <div className={`pb-40 ${isSideSheet ? 'px-6 pt-6' : 'container-fluid pt-0'}`}>
                {isLocal ? (
                  <div className="flex flex-col h-full items-center justify-center p-8 text-center space-y-6 max-w-xl mx-auto">
                    <CloudUpload size={28} strokeWidth={2.5} className="text-primary animate-pulse" />
                    <h2 className="text-2xl font-black uppercase text-on-surface">Saved Offline</h2>
                    <p className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest leading-relaxed">Note is secure locally. Sign in to analyze.</p>
                  </div>
                ) : isFailed ? (
                  <FailedState insight={insight} />
                ) : isProcessing ? (
                  <ProcessingState insight={insight} />
                ) : (
                  <InsightContentBody 
                    insight={insight} 
                    activeTasks={activeTasks} 
                    completedTasks={completedTasks} 
                    retryProcessing={retryAnalysis} 
                  />
                )}
            </div>
        </div>

        {activeDrawer && (
          <aside className={`
            ${(isMobile || isSideSheet) ? 'absolute inset-0 z-[250] bg-background animate-sheet-up' : 'w-[400px] absolute top-0 right-0 h-full border-l border-outline-variant/10 shadow-2xl z-40'} 
            flex flex-col transition-all duration-300 bg-background
          `}>
            {(isMobile || isSideSheet) && (
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                 <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
              </div>
            )}

            <div className={`flex items-center border-b border-outline-variant/10 bg-surface-container-low p-1.5 gap-1.5 shrink-0`}>
              <button 
                onClick={() => toggleDrawer('chat')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeDrawer === 'chat' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Chat
              </button>
              <button 
                onClick={() => toggleDrawer('info')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeDrawer === 'info' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Info
              </button>
              <button onClick={() => setActiveDrawer(null)} className="p-2.5 text-on-surface-variant hover:text-error transition-all"><X size={18} strokeWidth={3} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-background">
              {activeDrawer === 'info' ? (
                <InfoDrawer insight={insight} isSummarizing={isProcessing} isFailed={isFailed} />
              ) : (
                <ChatDrawer insight={insight} isFailed={isFailed} />
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default InsightDetailView;
