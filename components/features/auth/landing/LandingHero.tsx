
import React from 'react';
import { ArrowRight, Star, Activity, Mic, Database } from 'lucide-react';
import { triggerHaptic } from '../../../../services/hapticService';
import { HeroStat } from './HeroStat';

export const LandingHero: React.FC<any> = ({ onSignIn }) => {
  const handleSignIn = () => {
    triggerHaptic('medium');
    onSignIn();
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-background bg-grain border-b border-outline-variant/10">
      {/* Decorative Grid */}
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none text-on-surface" />
      
      {/* Decorative Center Burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-landing relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-12">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-surface/50 backdrop-blur-sm text-primary shadow-sm animate-fade-in">
            <Star size={10} fill="currentColor" strokeWidth={0} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Research Grade Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] text-on-background uppercase animate-slide-up">
            Think <br className="hidden md:block" />
            <span className="text-primary italic">Clearer.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-2xl text-on-background font-serif leading-relaxed max-w-2xl opacity-60 animate-slide-up [animation-delay:100ms]">
            The mechanical reasoning instrument for high-performance teams. 
            We turn noisy meetings into pristine strategic assets.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 animate-slide-up [animation-delay:200ms]">
            <button 
              onClick={handleSignIn} 
              className="px-10 h-16 bg-primary text-on-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Start Recording <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Systems Operational
            </div>
          </div>

          {/* Metrics / Stats Row */}
          <div className="pt-16 md:pt-24 w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-outline-variant/10 animate-slide-up [animation-delay:300ms]">
             <div className="flex flex-col items-center md:items-start">
               <HeroStat value="Zero" label="Meeting Bots" />
             </div>
             <div className="flex flex-col items-center md:items-start">
               <HeroStat value="100%" label="Private Vault" />
             </div>
             <div className="flex flex-col items-center md:items-start">
               <HeroStat value="24/7" label="Global Access" />
             </div>
             <div className="flex flex-col items-center md:items-start">
               <HeroStat value="AES-256" label="Encryption" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
