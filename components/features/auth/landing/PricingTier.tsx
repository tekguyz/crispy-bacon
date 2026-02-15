
import React from 'react';
import { Check, ArrowRight, Crown } from 'lucide-react';
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
  isPro?: boolean;
  onAction: () => void;
}

export const PricingTier: React.FC<PricingTierProps> = ({ 
  title, price, subtitle, features, isPro, onAction 
}) => {
  const handleAction = () => {
    triggerHaptic('medium');
    onAction();
  };

  return (
    <div className={`flex flex-col rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 relative group ${
      isPro 
        ? 'bg-on-surface text-surface shadow-2xl scale-[1.02] border-4 border-on-surface' 
        : 'bg-surface-container-low border border-outline-variant/20 hover:border-primary/20'
    }`}>
      
      {/* Header */}
      <div className="mb-8 border-b border-current/10 pb-8 space-y-4">
        <div className="flex justify-between items-start">
           <h3 className="text-sm font-black tracking-[0.25em] uppercase">{title}</h3>
           {isPro && <Crown size={20} className="text-primary animate-pulse" fill="currentColor" />}
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-slab font-bold tracking-tighter leading-none">{price}</span>
          {price !== 'Free' && <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">/mo</span>}
        </div>
        
        <p className="text-[11px] font-medium opacity-60 leading-relaxed max-w-[200px]">{subtitle}</p>
      </div>

      {/* Features */}
      <div className="flex-1 mb-10">
         <ul className="space-y-4">
           {features.map((f, i) => (
             <li key={i} className={`flex items-start gap-3 text-[11px] font-bold ${!f.included ? 'opacity-30' : ''}`}>
               <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <Check size={10} strokeWidth={4} />
               </div>
               <span className="uppercase tracking-wide leading-tight pt-0.5">{f.text}</span>
             </li>
           ))}
         </ul>
      </div>

      {/* Action */}
      <button 
        onClick={handleAction}
        className={`w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] active:scale-95 transition-all flex items-center justify-center gap-3 group ${
          isPro 
            ? 'bg-primary text-on-primary hover:brightness-110 shadow-lg' 
            : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high border border-outline-variant/10'
        }`}
      >
        {isPro ? 'Upgrade Access' : 'Start Free'}
        {isPro && <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
};
