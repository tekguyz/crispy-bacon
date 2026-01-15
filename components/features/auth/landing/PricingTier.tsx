
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
  badge?: string;
}

export const PricingTier: React.FC<PricingTierProps> = ({ 
  title, price, subtitle, features, extraFeatures, isPro, onAction 
}) => {
  const handleAction = () => {
    triggerHaptic('medium');
    onAction();
  };

  return (
    <div className={`relative flex flex-col rounded-sheet border-2 transition-all duration-500 group overflow-hidden ${
      isPro 
        ? 'bg-surface border-primary shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.1)]' 
        : 'bg-surface-container-low border-outline-variant shadow-sm'
    }`}>
      
      <div className="p-10 md:p-14 flex-1 flex flex-col relative z-10">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isPro ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface-variant'}`}>
                {isPro ? <Crown size={20} fill="currentColor" /> : <Zap size={20} />}
              </div>
              <h3 className="text-3xl font-serif font-bold tracking-tight uppercase leading-none">{title}</h3>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={`text-6xl font-mono font-black tracking-tighter leading-none ${isPro ? 'text-primary' : 'text-on-surface'}`}>{price}</span>
            <span className="text-[11px] font-black uppercase tracking-widest opacity-30">/mo</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-on-surface-variant opacity-60">{subtitle}</p>
        </div>

        <div className="space-y-12 flex-1">
          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className={`flex items-start gap-4 text-[13px] font-bold leading-tight ${!f.included ? 'opacity-20' : ''}`}>
                <div className={`mt-0.5 shrink-0 ${f.included ? 'text-primary' : 'text-foreground/20'}`}>
                  <Check size={18} strokeWidth={4} />
                </div>
                <span className="text-on-surface-variant tracking-wide">{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {extraFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/10 shadow-inner">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="text-[9px] font-mono font-black uppercase text-on-surface-variant/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAction}
          className={`w-full h-16 mt-12 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group/btn ${
            isPro 
              ? 'bg-primary text-on-primary hover:brightness-110 shadow-primary/20' 
              : 'bg-on-surface text-surface hover:opacity-90 shadow-foreground/5'
          }`}
        >
          {isPro ? 'Go Executive' : 'Get Started'}
          <ArrowRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
