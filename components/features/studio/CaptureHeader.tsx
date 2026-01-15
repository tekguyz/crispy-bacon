
import React from 'react';
import { X, Activity, Mic } from 'lucide-react';

interface CaptureHeaderProps {
  isRecording: boolean;
  isProcessing: boolean;
  view: string;
  onClose: () => void;
}

export const CaptureHeader: React.FC<CaptureHeaderProps> = ({ 
  isRecording, isProcessing, view, onClose 
}) => (
  <header className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-foreground/10 shrink-0 bg-surface-container-low pt-[env(safe-area-inset-top)] md:pt-0">
    <div className="flex items-center gap-4">
       <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface border border-foreground/10 shadow-inner">
          {isRecording || isProcessing ? <Activity size={18} className="text-primary animate-pulse" aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
       </div>
       <div className="flex flex-col text-left leading-tight">
          <h1 className="text-[12px] font-extrabold uppercase tracking-widest text-on-surface font-sans">
             {isProcessing ? 'Refining Recap' : isRecording ? 'Recording Live' : 'The Studio'}
          </h1>
          <span className="text-[8px] font-extrabold text-on-surface-variant/60 uppercase tracking-[0.3em]">
             {isProcessing ? 'Distilling Signal...' : view === 'setup' ? 'Initializing Instrument' : (isRecording ? 'Capturing Session' : 'Ready')}
          </span>
       </div>
    </div>
    {!isRecording && !isProcessing && (
      <button 
        onClick={onClose} 
        className="w-12 h-12 -mr-3 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Close studio"
      >
        <X size={20} strokeWidth={3} />
      </button>
    )}
  </header>
);
