
import React, { useState } from 'react';
import { RefreshCw, WifiOff, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { InsightContent, ProcessingStatus, ContentType } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { SummaryOverlay } from '../../ui/SummaryOverlay';
import { triggerHaptic } from '../../../services/hapticService';

interface StatusProps {
  insight: InsightContent;
}

export const FailedState: React.FC<StatusProps> = ({ insight }) => {
  const { retryProcessing, addToast } = useAppStore();
  const [isRescuing, setIsRescuing] = useState(false);

  const handleRescue = async () => {
    if (!insight.metadata?.audioUrl) {
      addToast("Original signal not found in local memory.", "warn");
      return;
    }
    
    setIsRescuing(true);
    triggerHaptic('medium');
    
    try {
      const response = await fetch(insight.metadata.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `rescue_${insight.id.substring(0,8)}_${insight.type === ContentType.MEETING ? 'audio.webm' : 'note.txt'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      addToast("Raw signal rescued to device.", "success");
    } catch (e) {
      addToast("Rescue failed. Check heartbeat history.", "error");
    } finally {
      setIsRescuing(false);
    }
  };

  const isOversized = insight.metadata?.durationSeconds && insight.metadata.durationSeconds > 3600;

  return (
    <div className="py-6 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in max-w-xl mx-auto">
      <div className="relative">
          <div className="absolute -inset-4 bg-error/5 blur-xl rounded-full" />
          <div className="w-20 h-20 bg-surface-container-high text-error rounded-[2rem] flex items-center justify-center relative border border-error/20 shadow-inner">
            <AlertCircle size={32} strokeWidth={2.5} />
          </div>
      </div>

      <div className="space-y-3 px-4">
        <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">
          {isOversized ? "Signal Overflow" : "Refinement Paused"}
        </h3>
        <p className="text-xs font-bold text-on-surface-variant opacity-60 leading-relaxed uppercase tracking-widest">
          {isOversized 
            ? "This session exceeds the refinement limit, but the raw data is secured in your vault."
            : "We couldn't finish refining this note. The original capture is safe."}
        </p>
      </div>

      <div className="w-full bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-success" />
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Note Secured</span>
            </div>
            <span className="text-[8px] font-mono font-bold opacity-30 uppercase tracking-widest">Capture_{insight.id.substring(0,6)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
                onClick={() => retryProcessing(insight)}
                className="flex items-center justify-center gap-3 px-6 h-14 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
            >
                <RefreshCw size={14} strokeWidth={3} /> Try Again
            </button>
            
            <button 
                onClick={handleRescue}
                disabled={isRescuing || !insight.metadata?.audioUrl}
                className="flex items-center justify-center gap-3 px-6 h-14 bg-surface-container-highest text-on-surface rounded-2xl font-black text-[10px] uppercase tracking-widest border border-outline-variant/20 hover:bg-background active:scale-[0.98] transition-all disabled:opacity-30"
            >
                <Download size={14} strokeWidth={3} /> Rescue Signal
            </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3 opacity-30 group">
         <div className="h-px w-8 bg-on-surface-variant" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em]">Zero Data Loss Active</p>
         <div className="h-px w-8 bg-on-surface-variant" />
      </div>
    </div>
  );
};

export const ProcessingState: React.FC<StatusProps> = ({ insight }) => {
  const { fetchData, addToast, setSelectedInsight } = useAppStore();

  const handleForceReset = async () => {
    const resetItem = { ...insight, processing_status: ProcessingStatus.FAILED, error_message: 'Capture stopped by user. Original data safe.' };
    setSelectedInsight(resetItem);
    addToast("Writing stopped. Capture safe.", "info");
  };

  return (
    <div className="relative h-full w-full min-h-[400px]">
      <SummaryOverlay 
        message="Refining Signal..." 
        isBackgroundable={true} 
        onClose={handleForceReset}
      />
    </div>
  );
};
