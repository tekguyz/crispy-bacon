
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Terminal, ShieldCheck, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { BaconLoader } from './Loaders';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { triggerHaptic } from '../../services/hapticService';

interface SummaryOverlayProps {
  onClose?: () => void;
  message?: string;
  isBackgroundable?: boolean;
}

export const SummaryOverlay: React.FC<SummaryOverlayProps> = ({ 
  onClose, 
  message = "Reasoning", 
  isBackgroundable = true 
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isLogExpanded, setIsLogExpanded] = useState(false);
  const systemLogs = useAppStore(state => state.systemLogs);
  const containerRef = useFocusTrap(true, onClose);

  const latestLog = systemLogs[0];
  const historyLogs = useMemo(() => systemLogs.slice(0, 10), [systemLogs]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleLog = () => {
    triggerHaptic('light');
    setIsLogExpanded(!isLogExpanded);
  };

  return (
    <div 
      className="absolute inset-0 z-50 bg-surface-container-lowest flex flex-col animate-fade-in overflow-hidden h-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-title"
      ref={containerRef as any}
    >
      {/* Header: Fixed Top */}
      <div className="w-full px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low shrink-0 z-20">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                     <Activity size={18} strokeWidth={3} className="animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                     <h2 id="analysis-title" className="text-base font-black uppercase italic tracking-[0.4em] text-on-surface leading-none">Distillation</h2>
                     <span className="text-[8px] font-mono font-black uppercase tracking-widest text-success mt-1">Protocol Active</span>
                  </div>
              </div>
              <div className="text-right">
                  <span className="text-2xl font-mono font-black text-primary tabular-nums tracking-tighter leading-none" aria-label={`Duration: ${seconds} seconds`}>{seconds}s</span>
              </div>
          </div>
      </div>

      {/* Main Content: Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4 flex flex-col items-center justify-center min-h-0">
          <div className="w-full max-w-2xl flex flex-col items-center gap-6 py-2">
             <div className="relative p-4">
                <BaconLoader />
             </div>
             
             <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-black font-display italic uppercase tracking-tight text-on-surface leading-none">
                  {message}
                </p>
                <div className="flex items-center justify-center gap-3">
                   <div className="h-px w-8 bg-outline-variant/20" />
                   <p className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.4em]">Recovering Signal</p>
                   <div className="h-px w-8 bg-outline-variant/20" />
                </div>
             </div>

             {/* Minimal Collapsible Log */}
             <div className="w-full max-w-md">
                <div className="bg-surface-container border border-outline-variant/20 rounded-2xl overflow-hidden shadow-inner transition-all duration-500">
                   <button 
                      onClick={toggleLog}
                      className="w-full px-5 py-4 flex items-center justify-between text-left group hover:bg-surface-container-high transition-colors"
                   >
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                            <Terminal size={12} strokeWidth={3} />
                         </div>
                         <div className="min-w-0">
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 block mb-0.5">Status Pulse</span>
                            <p className="text-[9px] font-mono font-black text-on-surface uppercase truncate">
                               {latestLog?.message || "Synchronizing with engine..."}
                            </p>
                         </div>
                      </div>
                      <div className="p-1 rounded-md border border-outline-variant/10 text-on-surface-variant/30 group-hover:text-primary transition-all">
                        {isLogExpanded ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                      </div>
                   </button>

                   {isLogExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-2 border-t border-outline-variant/5 animate-fade-in">
                         {historyLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                               <ChevronRight size={8} className="mt-1 text-primary shrink-0" strokeWidth={4} />
                               <span className="text-[8px] font-mono font-bold text-on-surface uppercase tracking-tight leading-tight">
                                  {log.message}
                               </span>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          </div>
      </div>

      {/* Footer: Background CTA */}
      <div className="w-full p-4 border-t border-outline-variant/10 bg-surface-container-low shrink-0 z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
             {isBackgroundable && onClose && (
               <button 
                  onClick={onClose}
                  className="w-full md:w-auto px-12 h-11 bg-on-surface text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all active:scale-[0.98] shadow-2xl shadow-black/10 flex items-center justify-center gap-3 group"
               >
                  Finish in Background
                  <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
               </button>
             )}
             <div className="flex items-center gap-2 opacity-20">
                <ShieldCheck size={10} className="text-success" />
                <span className="text-[7px] font-mono font-black uppercase tracking-widest text-on-surface">Cloud Secure Bridge</span>
             </div>
          </div>
      </div>
    </div>
  );
};
