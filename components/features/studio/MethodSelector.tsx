
import React from 'react';
import { ArrowRight, Layers, ShieldCheck, Mic, Monitor } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface MethodSelectorProps {
  onSelect: (isMeeting: boolean) => void;
  isPro: boolean;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ onSelect }) => {
  const handleSelect = (val: boolean) => {
    triggerHaptic('light');
    onSelect(val);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row animate-fade-in overflow-hidden">
      
      {/* LEFT PANEL: STATUS */}
      <aside className="w-full md:w-80 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/10 p-6 md:p-8 flex flex-col gap-8 shrink-0">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Ready to Capture</span>
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-success">Online</span>
              </div>
           </div>

           <div className="space-y-1.5 p-4 bg-background/50 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex justify-between items-center">
                 <span className="text-[8px] font-mono font-black text-on-surface-variant/40 uppercase">Privacy</span>
                 <span className="text-[8px] font-mono font-black text-success uppercase">Secure</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[8px] font-mono font-black text-on-surface-variant/40 uppercase">Storage</span>
                 <span className="text-[8px] font-mono font-black text-on-surface uppercase">Encrypted</span>
              </div>
           </div>
        </div>

        <div className="flex-1 hidden md:flex flex-col justify-end space-y-4 pb-4">
           <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
              <p className="text-[9px] font-bold text-on-surface-variant leading-relaxed">
                "We record your computer's audio directly. No bots will join your meeting, keeping your conversations natural and private."
              </p>
              <div className="flex items-center gap-2 opacity-30">
                 <ShieldCheck size={10} />
                 <span className="text-[7px] font-mono font-black uppercase tracking-widest">Private Recording</span>
              </div>
           </div>
        </div>
      </aside>

      {/* RIGHT PANEL: ACTION SELECTION */}
      <main className="flex-1 p-6 md:p-12 flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-xl mx-auto w-full space-y-10 relative z-10">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black font-display tracking-tighter uppercase text-on-surface leading-none">
              New <span className="text-primary">Note.</span>
            </h3>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">
              Choose how you want to capture information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleSelect(false)}
              className="group flex items-center gap-6 p-5 md:p-6 bg-surface-container-high border border-outline-variant/10 rounded-expressive hover:bg-background hover:border-primary/40 hover:shadow-2xl transition-all text-left active:scale-[0.98]"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-background rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <Mic size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-black font-display tracking-tight uppercase text-on-surface mb-1">Voice Memo</h4>
                <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-snug">
                  Capture a solo thought or a quick field note.
                </p>
              </div>
              <ArrowRight size={24} className="text-on-surface-variant/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>

            <button 
              onClick={() => handleSelect(true)}
              className="group flex items-center gap-6 p-5 md:p-6 bg-surface-container-high border border-outline-variant/10 rounded-expressive hover:bg-background hover:border-primary/40 hover:shadow-2xl transition-all text-left active:scale-[0.98]"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-background rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <Monitor size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-black font-display tracking-tight uppercase text-on-surface mb-1">Meeting Recap</h4>
                <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-snug">
                  Summarize any call—Zoom, Teams, or Meet—privately.
                </p>
              </div>
              <ArrowRight size={24} className="text-on-surface-variant/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
