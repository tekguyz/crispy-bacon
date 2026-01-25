
import React from 'react';
import { Target } from 'lucide-react';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

interface TakeawayGridProps {
  highlights?: string[];
}

const TakeawayGrid: React.FC<TakeawayGridProps> = ({ highlights = [] }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="space-y-6 animate-fade-in pt-4">
      {/* HEADER: Matches MarkdownRenderer H3 exactly */}
      <div className="flex items-center gap-3">
        <div className="p-1 bg-surface-container-high text-primary rounded border border-outline-variant/20 shadow-inner">
          <Target size={12} strokeWidth={3} />
        </div>
        <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-on-surface-variant/60 leading-none">Key Takeaways</h4>
      </div>

      <div className="flex flex-col gap-4">
        {highlights.map((h, i) => {
          const isLast = i === highlights.length - 1;
          return (
            <div key={i} className="flex items-start gap-4 md:gap-6 group">
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1.5">
                  <div className="w-5 h-5 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-on-primary shadow-sm group-hover:scale-105">
                     <span className="text-[8px] font-mono font-black">{i + 1}</span>
                  </div>
                  {!isLast && (
                    <div className="w-px h-full min-h-[12px] bg-outline-variant/20 rounded-full group-hover:bg-primary/30 transition-colors mt-0.5" />
                  )}
              </div>
              
              <div className="flex-1 pb-2">
                  {/* BODY: Matches MarkdownRenderer P (Serif, Medium, Larger) */}
                  <div className="text-lg md:text-xl font-medium font-serif text-on-surface leading-[1.5] tracking-tight">
                    <MarkdownRenderer content={h} className="inline-markdown" />
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(TakeawayGrid);
