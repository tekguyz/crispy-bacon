
import React from 'react';
import { Tag, Zap } from 'lucide-react';

interface TaxonomySectionProps {
  topics: string[];
  entities: string[];
  isDeepStrategist?: boolean;
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ topics, isDeepStrategist }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
         <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg shadow-inner border ${isDeepStrategist ? 'bg-primary/10 text-primary border-primary/20' : 'bg-on-surface/5 text-on-surface-variant border-outline-variant/10'}`}>
                {isDeepStrategist ? <Zap size={12} strokeWidth={3} /> : <Tag size={12} strokeWidth={3} />}
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">
              Topics
            </h3>
         </div>
         {isDeepStrategist && <span className="text-[7px] font-mono font-black text-primary/40 uppercase tracking-widest">PRO</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((t, i) => (
          <span 
            key={i} 
            className={`
              px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all border
              ${isDeepStrategist 
                ? 'bg-primary/[0.03] border-primary/10 text-on-surface hover:border-primary/40' 
                : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant/80 hover:border-primary/20'}
            `}
          >
            <span className={isDeepStrategist ? 'text-primary mr-1 opacity-50' : 'text-on-surface-variant/40 mr-1'}>#</span>
            {t.replace(/#/g, '')}
          </span>
        ))}
      </div>
    </section>
  );
};
