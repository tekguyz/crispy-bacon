
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
        <section className="bg-surface-container-low border border-outline-variant/10 rounded-expressive p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-surface-container-highest text-on-surface-variant rounded-2xl flex items-center justify-center opacity-50 mx-auto shadow-inner">
                <Sparkles size={32} className="icon-tactical" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">Summarizing...</h3>
            {onRetry && (
                <button onClick={onRetry} className="px-10 py-4 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all mx-auto flex items-center gap-3">
                    <RefreshCw size={14} strokeWidth={3} /> Re-analyze
                </button>
            )}
        </section>
    );
  }

  return (
    <section className="relative mb-24 group">
      {/* The Strategic Trace - Vertical line for depth perception */}
      <div className={`absolute -left-6 md:-left-12 top-0 bottom-0 w-2 rounded-full opacity-10 hidden md:block ${isDeepStrategist ? 'bg-amber-500' : 'bg-primary'}`} />
      
      <div className="flex items-center gap-3 mb-10">
        <div className={`p-2 rounded-xl shadow-inner ${isDeepStrategist ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
            <Quote size={18} strokeWidth={3} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Executive Summary</h3>
      </div>

      <div className="prose-summary">
        <MarkdownRenderer 
          content={summary} 
          className="text-xl md:text-2xl font-serif text-on-surface font-medium leading-relaxed selection:bg-primary/20 selection:text-primary animate-fade-in" 
        />
      </div>
    </section>
  );
};

export default React.memo(SummarySection);
