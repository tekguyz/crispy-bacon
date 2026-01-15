
import React from 'react';

interface TaxonomySectionProps {
  topics: string[];
  entities: string[];
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ topics, entities }) => {
  if (topics.length === 0 && entities.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
         <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">Extracted Signal</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics.length > 0 && (
          <div className="space-y-2">
             <span className="text-[8px] font-mono font-bold text-on-surface-variant/30 uppercase tracking-widest block">Topics</span>
             <div className="flex flex-wrap gap-2">
                {topics.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/10 rounded-lg text-[9px] font-bold uppercase tracking-tight text-on-surface shadow-sm">
                    {t}
                  </span>
                ))}
             </div>
          </div>
        )}

        {entities.length > 0 && (
          <div className="space-y-2">
             <span className="text-[8px] font-mono font-bold text-on-surface-variant/30 uppercase tracking-widest block">Entities</span>
             <div className="flex flex-wrap gap-2">
                {entities.map((e, i) => (
                  <span key={i} className="px-3 py-1.5 bg-surface-container-high/50 border border-outline-variant/10 rounded-lg text-[9px] font-bold uppercase tracking-tight text-on-surface-variant shadow-sm flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    {e}
                  </span>
                ))}
             </div>
          </div>
        )}
      </div>
    </section>
  );
};
