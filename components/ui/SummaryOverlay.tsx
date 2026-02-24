
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { BaconLoader } from './Loaders';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface SummaryOverlayProps {
  onClose?: () => void;
  message?: string;
  isBackgroundable?: boolean;
}

export const SummaryOverlay: React.FC<SummaryOverlayProps> = ({ 
  onClose, 
  message = "Analyzing", 
  isBackgroundable = true 
}) => {
  const [seconds, setSeconds] = useState(0);
  const containerRef = useFocusTrap(true, onClose);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div 
        className="absolute inset-0 z-50 bg-surface-container-lowest flex flex-col animate-fade-in overflow-hidden h-full pointer-events-auto"
        role="dialog"
        aria-modal="true"
        ref={containerRef as any}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          <div className="w-full max-w-2xl flex flex-col items-center gap-6 py-2">
             <div className="relative p-4">
                <BaconLoader />
             </div>
             
             <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-on-surface leading-none">
                  {message}...
                </p>
                <div className="flex items-center justify-center gap-3">
                   <div className="h-px w-8 bg-outline-variant/20" />
                   <p className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.4em]">Writing Notes</p>
                   <div className="h-px w-8 bg-outline-variant/20" />
                </div>
             </div>
          </div>
      </div>

      {/* Footer */}
      <div className="w-full p-4 border-t border-outline-variant/10 bg-surface-container-low shrink-0 z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
             {isBackgroundable && onClose && (
               <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="w-full md:w-auto px-12 h-11 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group pointer-events-auto"
               >
                  Continue in Background
                  <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
               </button>
             )}
             <div className="flex items-center gap-2 opacity-20">
                <ShieldCheck size={10} className="text-success" />
                <span className="text-[7px] font-black uppercase tracking-widest text-on-surface">Data is Private & Secure</span>
             </div>
          </div>
      </div>
    </div>
  );
};
