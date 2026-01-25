
import React from 'react';
import { Target } from 'lucide-react';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

interface TakeawayGridProps {
  highlights?: string[];
}

const TakeawayGrid: React.FC<TakeawayGridProps> = ({ highlights = [] }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 px-1">
        <div className="p-1 bg-surface-container-high text-primary rounded border border-outline-variant/20 shadow-inner">
          <Target size={12} strokeWidth={3} />
        </div>
        <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.35em] text-on-surface-variant opacity-40 leading-none">Key Takeaways</h4>
      </div>

      <div className="flex flex-col gap-4">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-4 md:gap-6 group">
            <div className="flex flex-col items-center gap-1.5 shrink-0 pt-1">
                <div className="w-5 h-5 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-on-primary shadow-sm group-hover:scale-105">
                   <span className="text-[8px] font-mono font-black">{i + 1}</span>
                </div>
                <div className="w-px h-6 bg-outline-variant/20 rounded-full group-hover:bg-primary/30 transition-colors" />
            </div>
            
            <div className="flex-1">
                <div className="text-sm md:text-base font-bold font-sans text-on-surface leading-relaxed tracking-tight">
                  <MarkdownRenderer content={h} className="inline-markdown" />
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(TakeawayGrid);
