
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
            <div className={`p-1.5 rounded-lg shadow-inner border ${isDeepStrategist ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {isDeepStrategist ? <Zap size={12} strokeWidth={3} /> : <Tag size={12} strokeWidth={3} />}
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">
              {isDeepStrategist ? 'Strategic Topics' : 'Key Topics'}
            </h3>
         </div>
         {isDeepStrategist && <span className="text-[7px] font-mono font-black text-amber-600/40 uppercase tracking-widest">PRO</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((t, i) => (
          <span 
            key={i} 
            className={`
              px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all border
              ${isDeepStrategist 
                ? 'bg-amber-500/[0.03] border-amber-500/10 text-on-surface hover:border-amber-500/40' 
                : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant/80 hover:border-primary/20'}
            `}
          >
            <span className={isDeepStrategist ? 'text-amber-600 mr-1 opacity-50' : 'text-primary/40 mr-1'}>#</span>
            {t.replace(/#/g, '')}
          </span>
        ))}
      </div>
    </section>
  );
};
