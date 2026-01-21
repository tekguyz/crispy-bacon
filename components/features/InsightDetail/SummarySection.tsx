
import React from 'react';
import { Quote, Sparkles, RefreshCw, Zap } from 'lucide-react';
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
            <h3 className="text-xl font-black uppercase tracking-widest text-on-surface-variant">Writing Recap...</h3>
            {onRetry && (
                <button onClick={onRetry} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all mx-auto flex items-center gap-3 active:scale-95">
                    <RefreshCw size={14} strokeWidth={3} /> Try Again
                </button>
            )}
        </section>
    );
  }

  return (
    <section className="relative group animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-2 rounded-lg shadow-inner border ${isDeepStrategist ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
            {isDeepStrategist ? <Zap size={16} strokeWidth={3} /> : <Quote size={16} strokeWidth={3} />}
        </div>
        <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-40 leading-none">
              {isDeepStrategist ? 'Deep Strategic Analysis' : 'Executive Recap'}
            </h3>
        </div>
      </div>

      <div className="prose-high-density">
        <MarkdownRenderer 
          content={summary} 
          className={`prose-summary font-serif text-on-surface ${isDeepStrategist ? 'is-pro-summary' : ''}`} 
        />
      </div>

      <style>{`
        .prose-summary p {
          font-size: 1.25rem;
          line-height: 1.8;
          margin-bottom: 2rem;
          color: var(--md-sys-color-on-surface);
        }
        .prose-high-density h3 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--md-sys-color-primary);
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }
        .prose-summary strong {
          font-weight: 800;
          color: var(--md-sys-color-on-surface);
        }
        @media (min-width: 768px) {
          .prose-summary p {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default React.memo(SummarySection);
