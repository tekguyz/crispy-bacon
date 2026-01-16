
import React from 'react';
import { ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { HeroStat } from './HeroStat';
import { triggerHaptic } from '../../../../services/hapticService';

export const LandingHero: React.FC<any> = ({ onSignIn }) => {
  const handleSignIn = () => {
    triggerHaptic('medium');
    onSignIn();
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
      
      <div className="container-landing grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-20">
        
        {/* COPY COLUMN */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 border border-primary/10 text-primary rounded-full mx-auto lg:mx-0">
            <ShieldCheck size={12} strokeWidth={3} />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">No-Bot Architecture</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-display font-bold tracking-tighter leading-[0.95] text-on-background text-balance uppercase italic">
              Distill signal <br /> 
              <span className="text-primary not-italic">from noise.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-background font-medium leading-relaxed max-w-xl opacity-60 mx-auto lg:mx-0">
              A mechanical instrument for professional reasoning. Capture system audio directly and recover facts without intrusive meeting bots.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-2">
            <button 
              onClick={handleSignIn} 
              className="w-full sm:w-auto px-8 h-14 bg-primary text-on-primary rounded-xl font-black text-[12px] uppercase tracking-[0.25em] shadow-m3-3 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              Initialize Library <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 px-4 text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant opacity-40">
               <Activity size={14} className="text-success animate-pulse" />
               System Ready
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-8 pt-8 lg:pt-10 border-t border-on-background/10">
            <HeroStat value="Direct" label="Audio Loop" />
            <HeroStat value="Zero" label="Meeting Bots" />
            <HeroStat value="Private" label="Vaulting" />
          </div>
        </div>

        {/* ILLUSTRATION COLUMN */}
        <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center animate-fade-in [animation-delay:200ms] h-[500px]">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative w-full aspect-square flex items-center justify-center scale-110">
             
             {/* 1. The Noise (Left Inputs) */}
             <div className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-4 space-y-6 opacity-40">
                <div className="w-32 h-2 bg-on-surface-variant/30 rounded-full animate-pulse [animation-duration:2s]" />
                <div className="w-20 h-2 bg-on-surface-variant/30 rounded-full animate-pulse [animation-duration:3s]" />
                <div className="w-40 h-2 bg-on-surface-variant/30 rounded-full animate-pulse [animation-duration:1.5s]" />
             </div>

             {/* 2. The Prism (Processing Core) */}
             <div className="relative z-20 w-48 h-72 bg-surface-container-low/80 backdrop-blur-md border border-outline-variant rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-8 transform -rotate-6 transition-transform hover:-rotate-3 duration-700 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl" />
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/20 group-hover:scale-110 transition-transform">
                   <Activity size={32} strokeWidth={2.5} />
                </div>
                <div className="space-y-3 w-full px-8">
                   <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
                   </div>
                   <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
                      <span>Analyzing</span>
                      <span>98%</span>
                   </div>
                </div>
             </div>

             {/* 3. The Signal (Right Output) */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30">
                <div className="bg-surface border border-outline rounded-2xl p-6 shadow-xl w-64 space-y-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center text-success">
                         <ShieldCheck size={16} strokeWidth={3} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Insight</span>
                   </div>
                   <div className="space-y-3">
                      <div className="h-2.5 w-full bg-surface-container-highest rounded-full" />
                      <div className="h-2.5 w-3/4 bg-surface-container-highest rounded-full" />
                   </div>
                   <div className="pt-3 border-t border-outline-variant/10">
                      <span className="text-[8px] font-mono font-bold text-primary uppercase tracking-widest">Actionable</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};