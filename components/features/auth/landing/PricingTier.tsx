import React from 'react';
import { Check, Crown, ArrowRight, Zap } from 'lucide-react';
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
    <div className={`relative flex flex-col rounded-[2rem] border-2 transition-all duration-700 group overflow-hidden ${
      isPro 
        ? 'bg-surface border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] ring-2 ring-primary/5' 
        : 'bg-surface-container-low border-outline-variant shadow-sm'
    }`}>
      
      <div className="p-8 md:p-10 flex-1 flex flex-col relative z-10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg border ${isPro ? 'bg-primary/10 text-primary border-primary/20' : 'bg-on-surface/5 text-on-surface-variant border-outline-variant'}`}>
                {isPro ? <Crown size={18} fill="currentColor" strokeWidth={0} /> : <Zap size={18} />}
              </div>
              <h3 className="text-xl font-serif font-bold tracking-tight uppercase leading-none">{title}</h3>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1.5">
            <span className={`text-5xl font-mono font-black tracking-tighter leading-none ${isPro ? 'text-primary' : 'text-on-surface'}`}>{price}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">/mo</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-4 text-on-surface-variant opacity-60 leading-relaxed max-w-[200px]">{subtitle}</p>
        </div>

        <div className="space-y-8 flex-1">
           <div className="space-y-3">
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-3 text-[13px] font-bold leading-tight ${!f.included ? 'opacity-20' : ''}`}>
                    <div className={`mt-0.5 shrink-0 ${f.included ? 'text-primary' : 'text-foreground/20'}`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-on-surface-variant tracking-wide uppercase text-[10px]">{f.text}</span>
                  </li>
                ))}
              </ul>
           </div>

          <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {extraFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/10 shadow-inner group-hover:border-primary/20 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span className="text-[9px] font-black uppercase text-on-surface-variant/70">{f}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <button 
          onClick={handleAction}
          className={`w-full h-14 mt-10 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 group/btn ${
            isPro 
              ? 'bg-primary text-on-primary hover:brightness-110 shadow-primary/20' 
              : 'bg-on-surface text-surface hover:opacity-90 shadow-foreground/5'
          }`}
        >
          {isPro ? 'Upgrade Pro' : 'Start Free'}
          <ArrowRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};