
import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

interface TakeawayGridProps {
  highlights?: string[];
}

const TakeawayGrid: React.FC<TakeawayGridProps> = ({ highlights = [] }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="space-y-12 mb-24 animate-fade-in">
      <div className="flex items-center gap-3 px-1">
        <div className="p-2 bg-surface-container-high text-primary rounded-xl border border-outline-variant/10 shadow-inner">
          <Target size={18} strokeWidth={2.5} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Key Points</h4>
      </div>

      <div className="flex flex-col gap-6">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-8 group">
            <div className="flex flex-col items-center gap-3 shrink-0 pt-2">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-on-primary shadow-sm group-hover:shadow-lg group-hover:scale-110">
                   <span className="text-[11px] font-mono font-black">0{i + 1}</span>
                </div>
                <div className="w-px h-12 bg-outline-variant/20 rounded-full group-hover:bg-primary/30 transition-colors" />
            </div>
            
            <div className="flex-1 pt-1 space-y-4">
                <p className="text-base md:text-lg font-bold font-sans text-on-surface leading-tight tracking-tight">
                  {h}
                </p>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <div className="h-px w-8 bg-primary/20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Source verified</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(TakeawayGrid);
