
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface ImportFooterProps {
  isVisible: boolean;
  isAnalyzing: boolean;
  isGuest: boolean;
  hasInput: boolean;
  onSubmit: () => void;
}

export const ImportFooter: React.FC<ImportFooterProps> = ({ 
  isVisible, isAnalyzing, isGuest, hasInput, onSubmit 
}) => {
  if (!isVisible) return null;

  return (
    <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low shrink-0">
      <button
        onClick={() => { triggerHaptic('medium'); onSubmit(); }}
        disabled={!hasInput || isAnalyzing}
        className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs transition-all ${hasInput ? 'bg-primary text-on-primary shadow-lg hover:shadow-xl active:scale-[0.98]' : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'}`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{isGuest ? 'Sign In to Analyze' : 'Start Analysis'}</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
      
      {isGuest && (
        <p className="text-center mt-3 text-[10px] text-on-surface-variant/60">
          You'll need to sign in to save this analysis to your library.
        </p>
      )}
    </div>
  );
};
