
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  domain: string;
  signal: string;
  specs: string[];
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, title, desc, domain, signal, specs 
}) => {
  return (
    <div className="group relative flex flex-col p-8 bg-surface border border-outline rounded-expressive shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/10 text-primary flex items-center justify-center transition-all duration-500 shadow-inner group-hover:bg-primary group-hover:text-on-primary">
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-primary leading-none mb-1">{domain}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-on-surface opacity-30">{signal}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-8 flex-1 relative z-10">
        <h3 className="text-2xl font-black tracking-tighter text-on-surface uppercase leading-none">{title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed font-medium opacity-70">
          {desc}
        </p>
      </div>

      <div className="pt-6 border-t border-outline-variant/10 flex flex-wrap gap-x-6 gap-y-2 relative z-10">
        {specs.map((spec, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-tight text-on-surface opacity-40 group-hover:opacity-100 transition-opacity">
              {spec}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
