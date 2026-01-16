
import React from 'react';
import { Quote, Sparkles, RefreshCw } from 'lucide-react';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

interface SummarySectionProps {
  summary: string;
  isDeepStrategist?: boolean;
  onRetry?: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary, isDeepStrategist, onRetry }) => {
  if (!summary || summary.length < 5) {
    return (
        <section className="bg-surface-container-low border-2 border-outline-variant/20 rounded-[2rem] p-12 text-center space-y-6 shadow-inner">
            <div className="w-16 h-16 bg-surface-container-highest text-on-surface-variant rounded-2xl flex items-center justify-center opacity-50 mx-auto shadow-inner border border-outline-variant/10">
                <Sparkles size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-on-surface-variant">Analyzing Signal...</h3>
            {onRetry && (
                <button onClick={onRetry} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all mx-auto flex items-center gap-3 active:scale-95">
                    <RefreshCw size={14} strokeWidth={3} /> Manual Re-analyze
                </button>
            )}
        </section>
    );
  }

  return (
    <section className="relative mb-24 group animate-fade-in">
      {/* The Strategic Trace - Stronger presence */}
      <div className={`absolute -left-6 md:-left-12 top-0 bottom-0 w-1.5 rounded-full opacity-20 hidden md:block ${isDeepStrategist ? 'bg-amber-500' : 'bg-primary'}`} />
      
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-2.5 rounded-xl shadow-inner border ${isDeepStrategist ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
            <Quote size={20} strokeWidth={3} />
        </div>
        <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-40 leading-none">Intelligence Recap</h3>
            {isDeepStrategist && <span className="text-[7px] font-mono font-black text-amber-600 uppercase tracking-widest mt-1">Strategic Depth Mode</span>}
        </div>
      </div>

      <div className="bg-surface-container-low/50 border-2 border-on-surface/5 p-8 md:p-12 rounded-[2.5rem] shadow-m3-1 relative overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
        <div className="relative z-10">
          <MarkdownRenderer 
            content={summary} 
            className="prose-summary font-serif" 
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(SummarySection);
