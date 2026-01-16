
import React from 'react';
import { Check, Crown, ArrowRight, Zap, Terminal, Box } from 'lucide-react';
import { triggerHaptic } from '../../../../services/hapticService';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTierProps {
  title: string;
  price: string;
  subtitle: string;
  features: PricingFeature[];
  extraFeatures: string[];
  isPro?: boolean;
  onAction: () => void;
}

export const PricingTier: React.FC<PricingTierProps> = ({ 
  title, price, subtitle, features, extraFeatures, isPro, onAction 
}) => {
  const handleAction = () => {
    triggerHaptic('medium');
    onAction();
  };

  return (
    <div className={`relative flex flex-col rounded-[2.5rem] border-2 transition-all duration-700 group overflow-hidden ${
      isPro 
        ? 'bg-surface border-on-surface shadow-[12px_12px_0px_0px_rgba(var(--primary-rgb),0.1)] ring-4 ring-primary/5' 
        : 'bg-surface-container-low border-outline-variant shadow-sm'
    }`}>
      {isPro && (
        <div className="bg-primary py-2 px-10 text-center">
           <span className="text-[8px] font-mono font-black uppercase tracking-[0.5em] text-on-primary">Model: Executive Strategic Array</span>
        </div>
      )}
      
      <div className="p-10 md:p-14 flex-1 flex flex-col relative z-10">
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${isPro ? 'bg-primary/10 text-primary border-primary/20' : 'bg-on-surface/5 text-on-surface-variant border-outline-variant'}`}>
                {isPro ? <Crown size={22} fill="currentColor" strokeWidth={0} /> : <Zap size={22} />}
              </div>
              <h3 className="text-3xl font-serif font-bold tracking-tight uppercase leading-none">{title}</h3>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={`text-7xl font-mono font-black tracking-tighter leading-none ${isPro ? 'text-primary' : 'text-on-surface'}`}>{price}</span>
            <span className="text-[12px] font-black uppercase tracking-widest opacity-30">/mo</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 text-on-surface-variant opacity-60 leading-relaxed max-w-[220px]">{subtitle}</p>
        </div>

        <div className="space-y-12 flex-1">
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-1 opacity-40">
                 <Terminal size={12} />
                 <span className="text-[9px] font-mono font-black uppercase tracking-widest">Capabilities</span>
              </div>
              <ul className="space-y-5">
                {features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-4 text-[14px] font-bold leading-tight ${!f.included ? 'opacity-20' : ''}`}>
                    <div className={`mt-0.5 shrink-0 ${f.included ? 'text-primary' : 'text-foreground/20'}`}>
                      <Check size={18} strokeWidth={4} />
                    </div>
                    <span className="text-on-surface-variant tracking-wide uppercase text-[12px]">{f.text}</span>
                  </li>
                ))}
              </ul>
           </div>

          <div className="space-y-4">
              <div className="flex items-center gap-3 px-1 opacity-40">
                 <Box size={12} />
                 <span className="text-[9px] font-mono font-black uppercase tracking-widest">Standard Specs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extraFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 shadow-inner group-hover:border-primary/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-[10px] font-mono font-black uppercase text-on-surface-variant/70">{f}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <button 
          onClick={handleAction}
          className={`w-full h-16 mt-14 rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 group/btn ${
            isPro 
              ? 'bg-primary text-on-primary hover:brightness-110 shadow-primary/20 ring-4 ring-primary/10' 
              : 'bg-on-surface text-surface hover:opacity-90 shadow-foreground/5'
          }`}
        >
          {isPro ? 'Initialize Tier' : 'Entry Protocol'}
          <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};
