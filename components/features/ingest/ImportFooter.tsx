import React from 'react';
import { Loader2, LogIn, CornerDownLeft } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface ImportFooterProps {
  isVisible: boolean;
  isProcessing: boolean;
  isGuest: boolean;
  hasInput: boolean;
  onSubmit: () => void;
}

export const ImportFooter: React.FC<ImportFooterProps> = ({ 
  isVisible, isProcessing, isGuest, hasInput, onSubmit 
}) => {
  if (!isVisible) return null;

  return (
    <div className="p-4 border-t border-outline-variant/5 bg-surface-container-low flex flex-col gap-4 shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:pb-4">
       <button
          onClick={() => { triggerHaptic('medium'); onSubmit(); }}
          disabled={isProcessing || !hasInput}
          className="w-full h-14 md:h-12 bg-primary text-on-primary rounded-xl md:rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed focus:outline-none"
       >
          {isProcessing ? <Loader2 size={16} className="animate-spin shrink-0" /> : (isGuest ? <LogIn size={16} strokeWidth={3} className="shrink-0" /> : <CornerDownLeft size={16} strokeWidth={3} className="shrink-0" />)}
          {isProcessing ? 'Working...' : (isGuest ? 'Unlock Full Notes' : 'Create Note')}
       </button>
    </div>
  );
};