
import React, { memo } from 'react';
import { InsightContent, ContentType, ProcessingStatus, AppView } from '../../types';
import { Star, Archive, Radio, AlertCircle, Video, Globe, FileText, Lock, ShieldAlert, Trash2, Check, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { triggerHaptic } from '../../services/hapticService';

interface InsightRowProps {
  insight: InsightContent;
}

const InsightRow: React.FC<InsightRowProps> = ({ insight }) => {
  const userProfile = useAppStore(s => s.userProfile);
  const isSelectionMode = useAppStore(s => s.isSelectionMode);
  const isSelected = useAppStore(s => s.selectedItemIds.includes(insight.id));
  const view = useAppStore(s => s.view);

  const { 
    toggleFavorite, toggleArchive, deleteInsight, deleteInsightForever, restoreInsight, setSelectedInsight, 
    openConfirmation, setShowUpgradeModal, toggleSelection 
  } = useAppStore.getState();

  const isPro = !!userProfile?.is_pro;
  const isProcessing = insight.processing_status === ProcessingStatus.PROCESSING || insight.processing_status === ProcessingStatus.PENDING;
  const isFailed = insight.processing_status === ProcessingStatus.FAILED;
  const isTrashView = view === AppView.TRASH;
  
  const isLocked = !isPro && !isProcessing && !isFailed && (Date.now() - new Date(insight.created_at).getTime() > 7 * 24 * 60 * 60 * 1000);

  const getTypeIcon = () => {
    if (isProcessing) return <Radio size={16} className="text-primary animate-pulse icon-tactical" />;
    if (isFailed) return <AlertCircle size={16} className="text-error icon-tactical" />;
    if (isLocked) return <Lock size={16} className="text-on-surface opacity-40 icon-tactical" />;
    
    switch(insight.type) {
      case ContentType.MEETING: return <Video size={16} className="text-primary/60 icon-tactical" />;
      case ContentType.URL: return <Globe size={16} className="text-blue-500/60 icon-tactical" />;
      default: return <FileText size={16} className="text-on-surface-variant/60 icon-tactical" />;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (useAppStore.getState().isSelectionMode) {
      e.stopPropagation();
      toggleSelection(insight.id);
      return;
    }
    if (isLocked) {
      triggerHaptic('medium');
      setShowUpgradeModal(true);
      return;
    }
    triggerHaptic('light');
    setSelectedInsight(insight);
  };

  const handleSelectionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelection(insight.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');

    if (isTrashView) {
      openConfirmation({
        title: 'Delete Forever?',
        message: `Permanently remove "${insight.title}"? This action cannot be undone.`,
        variant: 'danger',
        confirmLabel: 'Delete Forever',
        onConfirm: () => {
          triggerHaptic('heavy');
          deleteInsightForever(insight.id);
        }
      });
    } else {
      openConfirmation({
        title: 'Delete Note?',
        message: `Move "${insight.title}" to Trash?`,
        variant: 'danger',
        onConfirm: () => {
          triggerHaptic('heavy');
          deleteInsight(insight.id);
        }
      });
    }
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    restoreInsight(insight.id);
  };

  // Synchronized Preview logic
  const summaryPreview = (insight.summary || "No summary available.")
    .replace(/^#+\s*(?:OVERVIEW|SUMMARY|EXECUTIVE|RECAP|THEMES|KEY)\b/gim, '')
    .replace(/^#+\s+/gm, '') 
    .replace(/(\*\*|__)/g, '')
    .replace(/(\*|_)/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return (
    <div 
      onClick={handleClick}
      className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-all cursor-pointer relative overflow-hidden animate-hydrate ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''} ${isSelected ? 'bg-primary/10' : ''}`}
    >
      <div className={`w-6 h-6 shrink-0 transition-opacity duration-300 ${isSelectionMode ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
         <button 
           onClick={handleSelectionToggle}
           className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary shadow-sm' : 'bg-background border-outline-variant/30 hover:border-primary'}`}
         >
            {isSelected && <Check size={10} className="text-on-primary icon-tactical" />}
         </button>
      </div>

      <div className="w-10 h-10 rounded-xl bg-surface-container-high/50 flex items-center justify-center shrink-0 border border-outline-variant/5">
        {getTypeIcon()}
      </div>

      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-4">
        <div className="md:w-1/3 shrink-0 flex items-center gap-2">
            <h3 className="text-sm font-black text-on-surface truncate leading-tight uppercase">{insight.title}</h3>
            {insight.metadata?.isDeepStrategist && !isLocked && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 md:hidden" title="Deep analysis active" />
            )}
        </div>
        
        <div className="flex-1 min-w-0">
           {isProcessing ? (
             <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-widest">Writing...</span>
           ) : isFailed ? (
             <span className="text-[10px] font-black text-error uppercase tracking-widest">Error</span>
           ) : isLocked ? (
             <span className="text-[10px] font-normal text-on-surface-variant flex items-center gap-1.5 uppercase tracking-widest opacity-60">
                <ShieldAlert size={10} className="icon-tactical" /> Note Locked
             </span>
           ) : (
             <p className="text-sm font-normal text-on-surface-variant/80 truncate hidden sm:block leading-normal">
                {summaryPreview}
             </p>
           )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        <div className="text-[9px] md:text-[10px] font-mono font-black text-on-surface-variant/60 uppercase tracking-tighter tabular-nums whitespace-nowrap">
           {new Date(insight.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
        </div>

        {!isSelectionMode && (
          <div className={`flex items-center gap-0.5 md:gap-1 transition-opacity duration-200 ${isLocked ? 'opacity-0 pointer-events-none' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
            {isTrashView ? (
              <button 
                onClick={handleRestore}
                aria-label="Restore Note"
                title="Restore Note"
                className="p-2.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              >
                <RotateCcw size={14} className="icon-tactical" />
              </button>
            ) : (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(insight.id); }}
                  aria-label="Toggle Favorite"
                  className={`p-2.5 rounded-lg hover:bg-surface-container-high transition-colors ${insight.is_favorite ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                >
                  <Star size={14} fill={insight.is_favorite ? "currentColor" : "none"} className="icon-tactical" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleArchive(insight.id); }}
                  aria-label="Toggle Archive"
                  className="p-2.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant/40 hover:text-on-surface transition-colors"
                >
                  <Archive size={14} className="icon-tactical" />
                </button>
              </>
            )}
            <button 
              onClick={handleDelete}
              aria-label={isTrashView ? "Delete Forever" : "Delete Note"}
              title={isTrashView ? "Delete Forever" : "Delete Note"}
              className="p-2.5 rounded-lg hover:bg-error/10 text-on-surface-variant/40 hover:text-error transition-colors"
            >
              <Trash2 size={14} className="icon-tactical" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(InsightRow);
