
import React, { useState } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  desc: string;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon: Icon, desc, badge }) => (
  <div className="bg-surface-container-low border border-outline rounded-[1.5rem] p-6 transition-all hover:bg-surface-container shadow-sm group animate-slide-up">
    <div className="flex justify-between items-start mb-5">
      <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner border border-outline-variant/10">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      {badge && (
        <span className="px-2.5 py-1 bg-on-surface text-surface rounded text-[8px] font-black uppercase tracking-widest shadow-sm">
          {badge}
        </span>
      )}
    </div>
    <h4 className="text-sm font-black text-on-surface tracking-tight mb-2 uppercase leading-none">{title}</h4>
    <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-70 font-bold uppercase tracking-wide">{desc}</p>
  </div>
);

interface FrameworkCardProps {
  title: string;
  icon: LucideIcon;
  desc: string;
  focusPoints: string[];
}

export const FrameworkCard: React.FC<FrameworkCardProps> = ({ title, icon: Icon, desc, focusPoints }) => (
  <div className="bg-surface border border-outline p-6 rounded-[2rem] space-y-6 shadow-sm hover:border-primary transition-all group">
     <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <h4 className="text-lg font-black font-display tracking-tight uppercase leading-none">{title}</h4>
     </div>
     <p className="text-xs text-on-surface-variant leading-relaxed font-bold opacity-60 uppercase tracking-widest">{desc}</p>
     <div className="flex flex-wrap gap-2 pt-2">
        {focusPoints.map((point: string, i: number) => (
          <span key={i} className={`px-3 py-1.5 bg-surface-container-high text-on-surface text-[8px] font-black uppercase tracking-widest rounded-lg border border-outline group-hover:border-primary/20 transition-colors`}>
             {point}
          </span>
        ))}
     </div>
  </div>
);

interface CollapsibleFeatureListProps {
  title: string;
  features: string[];
  isPro?: boolean;
}

export const CollapsibleFeatureList: React.FC<CollapsibleFeatureListProps> = ({ title, features, isPro }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mt-6 border-t border-outline transition-all duration-500 overflow-hidden ${isOpen ? 'pb-4' : 'pb-0'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isOpen ? 'text-primary' : 'text-on-surface-variant opacity-40 group-hover:opacity-100'}`}>
          {title}
        </span>
        <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-highest text-on-surface-variant border border-outline'}`}>
          <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <div className={`space-y-3 transition-all duration-500 ease-emphasized ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-4 px-2">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-sm shrink-0 rotate-45 ${isPro ? 'bg-primary' : 'bg-on-surface-variant opacity-20'}`} />
            <span className="text-[11px] font-bold text-on-surface-variant opacity-70 leading-snug uppercase tracking-widest">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
