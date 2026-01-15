
import React from 'react';
import { ArrowLeft, Monitor, ShieldCheck, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface PreFlightCheckProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const PreFlightCheck: React.FC<PreFlightCheckProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 animate-fade-in max-w-2xl mx-auto w-full overflow-y-auto custom-scrollbar">
      <div className="w-full bg-surface-container-high border border-outline-variant/10 rounded-expressive p-5 md:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
          <Monitor size={100} />
        </div>

        <button 
          onClick={() => { triggerHaptic('light'); onCancel(); }}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors self-start"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Back
        </button>

        <div className="space-y-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
              <ShieldCheck size={10} /> Setup
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-display tracking-tighter uppercase text-on-surface leading-none">Ready to Record?</h3>
            <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-tight max-w-sm">
              We capture your computer's audio directly for clear notes.
            </p>
          </div>

          <div className="bg-background rounded-xl border-2 border-primary/20 p-4 shadow-inner">
             <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-primary text-on-primary flex items-center justify-center font-black text-[10px] shrink-0">1</div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-on-surface leading-snug">
                      Check <span className="font-black">"Share System Audio"</span> in the pop-up.
                    </p>
                    <div className="bg-surface-container-low border border-primary/10 rounded-lg p-2 flex items-center gap-3 animate-pulse">
                        <div className="w-3.5 h-3.5 rounded border-2 border-primary bg-primary flex items-center justify-center shrink-0" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-primary truncate">Share system audio</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button 
              onClick={() => { triggerHaptic('medium'); onConfirm(); }}
              className="w-full h-12 md:h-14 bg-primary text-on-primary rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Start Recording <Monitor size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex items-center justify-center gap-2 text-[7px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.3em] text-center px-4">
              <AlertCircle size={9} /> Private recording.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
