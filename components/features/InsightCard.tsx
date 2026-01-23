import React, { memo } from 'react';
import { InsightContent, Sentiment, ContentType, ProcessingStatus, AppView } from '../../types';
import { Calendar, Clock, Trash2, Star, Loader2, ArrowRight, Mic, Globe, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { triggerHaptic } from '../../services/hapticService';

interface InsightCardProps {
  insight: InsightContent;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const userProfile = useAppStore(s => s.userProfile);
  const isSelectionMode = useAppStore(s => s.isSelectionMode);
  const isSelected = useAppStore(s => s.selectedItemIds.includes(insight.id));
  const view = useAppStore(s => s.view);
  const globalIsProcessing = useAppStore(s => s.isProcessing);
  const isRecording = useAppStore(s => s.isRecording);

  const { 
    deleteInsight, deleteInsightForever, restoreInsight, setSelectedInsight, openConfirmation, 
    setShowUpgradeModal, toggleSelection 
  } = useAppStore.getState();

  const isPro = !!userProfile?.is_pro;
  
  const isActuallyProcessing = insight.processing_status === ProcessingStatus.PROCESSING || 
                               insight.processing_status === ProcessingStatus.PENDING || 
                               insight.processing_status === ProcessingStatus.SYNCING;
                               
  const hasContent = (insight.summary && insight.summary.length > 10) || 
                     (insight.metadata?.completedActionIndices && insight.metadata.completedActionIndices.length > 0);

  const isFailed = insight.processing_status === ProcessingStatus.FAILED;
  const isTrashView = view === AppView.TRASH;

  const isLocked = !isPro && !isActuallyProcessing && !isFailed && (Date.now() - new Date(insight.created_at).getTime() > 7 * 24 * 60 * 60 * 1000);

  const handleAction = () => {
    if (useAppStore.getState().isSelectionMode) {
      toggleSelection(insight.id);
      return;
    }
    
    if (isRecording) return;
    if (isActuallyProcessing && !hasContent && globalIsProcessing) return; 

    if (isLocked) {
      triggerHaptic('medium');
      setShowUpgradeModal(true);
      return;
    }
    triggerHaptic('light');
    setSelectedInsight(insight);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    }
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
        title: 'Delete Recap?',
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

  const displayTitle = (insight.title && insight.title !== "Summarizing..." && insight.title !== "Analyzing...") 
    ? insight.title 
    : (insight.type === ContentType.MEETING ? "Voice Note" : "Web Research");

  // Granola Optimization: Remove header lines entirely for the card preview
  const summaryPreview = (insight.summary || insight.error_message || "No summary available.")
    .replace(/^#+.*$/gm, '') // Remove entire lines starting with headers
    .replace(/\*\*/g, '')    // Remove bold symbols
    .replace(/\n+/g, ' ')    // Flatten into single line for clamping
    .trim();

  return (
    <article 
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      tabIndex={isRecording ? -1 : 0}
      role="button"
      aria-label={`${displayTitle}.`}
      className={`
        group relative bg-card rounded-expressive p-6 flex flex-col h-full transition-all duration-300 interactive border-2 outline-none
        ${isActuallyProcessing && !hasContent ? 'cursor-wait opacity-80' : 'cursor-pointer'} 
        ${isLocked ? 'grayscale opacity-60' : ''} 
        ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-outline hover:border-primary/50'}
      `} 
    >
      <header className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant opacity-60`}>
                {new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            {isFailed ? (
              <span className="text-[9px] font-black text-error uppercase tracking-widest">ERROR</span>
            ) : (isActuallyProcessing && !hasContent) ? (
              <span className="text-[9px] font-black text-primary flex items-center gap-1 animate-pulse uppercase tracking-widest">
                <Loader2 size={8} className="animate-spin" /> WORKING
              </span>
            ) : (
              <span className={`text-[9px] font-black uppercase tracking-widest ${insight.sentiment === Sentiment.POSITIVE ? 'text-success' : 'text-on-surface-variant/50'}`}> 
                {insight.sentiment || 'NEUTRAL'}
              </span>
            )}
            {insight.is_favorite && !isActuallyProcessing && <Star size={10} className="text-primary fill-current" aria-hidden="true" />}
          </div>
          <h3 className={`text-xl md:text-2xl font-serif font-bold text-on-surface tracking-tight leading-[1.1] line-clamp-2 ${isActuallyProcessing && !hasContent ? 'opacity-30' : 'group-hover:text-primary transition-colors'}`}>
            {displayTitle}
          </h3> 
        </div>
        <div className="w-9 h-9 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0 border border-outline-variant text-on-surface-variant opacity-40">
           {insight.type === ContentType.MEETING ? <Mic size={16} /> : <Globe size={16} />}
        </div>
      </header>

      <div className="text-on-surface-variant mb-6 leading-relaxed line-clamp-3 text-sm font-medium opacity-80 relative z-10"> 
        {(isActuallyProcessing && !hasContent) ? "Recovering skeletal signal from noise..." : summaryPreview}
      </div>

      <footer className="mt-auto pt-4 flex justify-between items-center border-t border-outline-variant relative z-10"> 
        <div className="flex items-center gap-3 text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant opacity-50">
          <span className="flex items-center gap-1"><Clock size={10} /> {insight.metadata?.readingTimeMinutes || 1}M READ</span>
        </div>
        
        <div className="flex items-center gap-1">
           {isTrashView && (
              <button 
                onClick={handleRestore}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-all shadow-sm"
              >
                <RotateCcw size={14} />
              </button>
           )}
           <button 
             onClick={handleDelete}
             className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all"
           >
             <Trash2 size={14} />
           </button>
           {!isTrashView && (
             <div className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/30 group-hover:text-primary transition-colors">
                <ArrowRight size={14} strokeWidth={3} />
             </div>
           )}
        </div>
      </footer>
    </article>
  );
};

export default memo(InsightCard);