
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
        <section className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-10 text-center space-y-6 shadow-inner">
            <div className="w-12 h-12 bg-surface-container-highest text-on-surface-variant rounded-xl flex items-center justify-center opacity-50 mx-auto shadow-inner border border-outline-variant/10">
                <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Writing Recap...</h3>
            {onRetry && (
                <button onClick={onRetry} className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all mx-auto flex items-center gap-2 active:scale-95">
                    <RefreshCw size={12} strokeWidth={3} /> Try Again
                </button>
            )}
        </section>
    );
  }

  // Pre-process summary to ensure header separation and cleanliness
  const formattedSummary = summary
    .replace(/\\n/g, '\n') 
    .replace(/(### [^\n]+)\n([^\n])/g, '$1\n\n$2')
    .replace(/---\n/g, ''); // Explicitly strip HR dividers that clutter the high-density prose

  return (
    <section className="relative group animate-fade-in w-full">
      <div className="prose-high-density w-full">
        <MarkdownRenderer 
          content={formattedSummary} 
          className={`prose-summary font-serif text-on-surface ${isDeepStrategist ? 'is-pro-summary' : ''}`} 
        />
      </div>

      <style>{`
        /* Structural Rhythm for High-Density Prose */
        .prose-summary p {
          margin-bottom: 1.5rem;
          color: var(--md-sys-color-on-surface);
        }
        
        .prose-summary > div > h3:first-child,
        .prose-summary h3:first-of-type {
          margin-top: 0 !important;
        }

        .prose-summary strong {
          font-weight: 800;
          color: var(--md-sys-color-on-surface);
        }
      `}</style>
    </section>
  );
};

export default React.memo(SummarySection);
