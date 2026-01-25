import React, { memo } from 'react';
import { InsightContent, Sentiment, ContentType, ProcessingStatus, AppView } from '../../types';
import { Clock, Trash2, Star, Loader2, ArrowRight, Mic, Globe, RotateCcw } from 'lucide-react';
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

  const { 
    deleteInsight, deleteInsightForever, restoreInsight, setSelectedInsight, openConfirmation, 
    setShowUpgradeModal, toggleSelection 
  } = useAppStore.getState();

  const isPro = !!userProfile?.is_pro;
  const isTrashView = view === AppView.TRASH;
  
  const isActuallyProcessing = insight.processing_status === ProcessingStatus.PROCESSING || 
                               insight.processing_status === ProcessingStatus.PENDING;
                               
  const hasContent = (insight.summary && insight.summary.length > 10);
  const isFailed = insight.processing_status === ProcessingStatus.FAILED;
  const isLocked = !isPro && !isActuallyProcessing && !isFailed && (Date.now() - new Date(insight.created_at).getTime() > 7 * 24 * 60 * 60 * 1000);

  const handleAction = () => {
    if (isSelectionMode) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    if (isTrashView) {
      openConfirmation({
        title: 'Delete Forever?',
        message: `Permanently remove "${insight.title}"?`,
        variant: 'danger',
        onConfirm: () => deleteInsightForever(insight.id)
      });
    } else {
      openConfirmation({
        title: 'Move to Trash',
        message: `Move "${insight.title}" to Trash?`,
        variant: 'danger',
        onConfirm: () => deleteInsight(insight.id)
      });
    }
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    restoreInsight(insight.id);
  };

  const summaryPreview = (insight.summary || "No summary available.")
    .replace(/^#+.*$/gm, '') 
    .replace(/\*\*/g, '')    
    .replace(/\n+/g, ' ')    
    .trim();

  return (
    <article 
      onClick={handleAction}
      className={`
        group relative bg-surface border-2 rounded-[1.5rem] p-5 flex flex-col h-full transition-all duration-300 interactive
        ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02]' : 'border-outline hover:border-primary/40'}
        ${isLocked ? 'grayscale opacity-60' : ''}
      `} 
    >
      {/* 1. TOP SIGNAL LAYER */}
      <header className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 h-4">
            <span className="text-[8px] font-mono font-black uppercase tracking-widest text-on-surface-variant/40">
                {new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            {isActuallyProcessing ? (
              <span className="text-[8px] font-black text-primary flex items-center gap-1 uppercase tracking-widest animate-pulse">
                <Loader2 size={8} className="animate-spin" /> WORKING
              </span>
            ) : isFailed ? (
              <span className="text-[8px] font-black text-error uppercase tracking-widest">ERROR</span>
            ) : (
              <span className={`text-[8px] font-black uppercase tracking-widest ${insight.sentiment === Sentiment.POSITIVE ? 'text-success' : 'text-on-surface-variant/30'}`}> 
                {insight.sentiment || 'NEUTRAL'}
              </span>
            )}
            {insight.is_favorite && <Star size={9} className="text-primary fill-current" />}
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-on-surface tracking-tight leading-[1.1] line-clamp-2">
            {insight.title || (insight.type === ContentType.MEETING ? "Voice Note" : "Web Research")}
          </h3> 
        </div>
        <div className="w-8 h-8 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/10 text-on-surface-variant/40">
           {insight.type === ContentType.MEETING ? <Mic size={14} /> : <Globe size={14} />}
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="text-[13px] font-medium text-on-surface-variant/70 mb-4 leading-relaxed line-clamp-3"> 
        {isActuallyProcessing && !hasContent ? "Reasoning in progress..." : summaryPreview}
      </div>

      {/* 3. COMPRESSED UTILITY ZONE (Footer) */}
      <footer className="mt-auto flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity"> 
        <div className="flex items-center gap-3 text-[8px] font-mono font-black uppercase tracking-widest text-on-surface-variant">
          <span className="flex items-center gap-1.5"><Clock size={10} strokeWidth={3} /> {insight.metadata?.readingTimeMinutes || 1}M READ</span>
        </div>
        
        <div className="flex items-center gap-1">
           {isTrashView ? (
              <button 
                onClick={handleRestore}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
                aria-label="Restore"
              >
                <RotateCcw size={12} strokeWidth={3} />
              </button>
           ) : null}
           <button 
             onClick={handleDelete}
             className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error/5 transition-colors"
             aria-label="Delete"
           >
             <Trash2 size={12} strokeWidth={3} />
           </button>
           {!isTrashView && (
             <div className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/20 group-hover:text-primary transition-colors">
                <ArrowRight size={12} strokeWidth={4} />
             </div>
           )}
        </div>
      </footer>
    </article>
  );
};

export default memo(InsightCard);