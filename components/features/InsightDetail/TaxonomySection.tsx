
import React from 'react';
import { Tag } from 'lucide-react';

interface TaxonomySectionProps {
  topics: string[];
  entities: string[];
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ topics }) => {
  if (topics.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
         <div className="p-1.5 bg-primary/10 text-primary rounded-lg shadow-inner">
            <Tag size={12} strokeWidth={3} />
         </div>
         <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">Smart Tags</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((t, i) => (
          <span key={i} className="px-3 py-2 bg-surface-container-low border border-outline-variant/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-on-surface shadow-sm hover:border-primary/20 transition-all cursor-default">
            #{t}
          </span>
        ))}
      </div>
    </section>
  );
};
