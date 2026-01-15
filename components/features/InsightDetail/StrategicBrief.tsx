import React from 'react';
import { Target } from 'lucide-react';

interface StrategicBriefProps {
  highlights?: string[];
}

const StrategicBrief: React.FC<StrategicBriefProps> = ({ highlights = [] }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="p-1.5 bg-primary/10 text-primary rounded-lg shadow-inner">
          <Target size={14} strokeWidth={3} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">Key Points</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((h, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-6 items-start bg-surface-container-low p-10 rounded-[2rem] border border-outline-variant/10 hover:border-primary/20 transition-all shadow-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] shrink-0 sm:mt-1 shadow-inner group-hover:bg-primary group-hover:text-on-primary transition-colors">
              {i + 1}
            </div>
            <p className="text-lg font-bold text-on-surface/80 leading-snug tracking-tight">
              {h}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(StrategicBrief);