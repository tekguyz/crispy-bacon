import React from 'react';
import { ArrowRight, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { HeroStat } from './HeroStat';
import { triggerHaptic } from '../../../../services/hapticService';

export const LandingHero: React.FC<any> = ({ onSignIn }) => {
  const handleSignIn = () => {
    triggerHaptic('medium');
    onSignIn();
  };

  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden bg-background">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
      
      <div className="container-landing relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* COPY COLUMN */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 border border-primary/10 text-primary rounded-full">
              <Sparkles size={12} strokeWidth={3} />
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">Professional Research Assistant</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold tracking-tighter leading-[0.85] text-on-background text-balance uppercase italic">
                Distill signal <br /> 
                <span className="text-primary not-italic">from noise.</span>
              </h1>
              <p className="text-lg md:text-xl text-on-background font-medium font-serif leading-relaxed max-w-xl opacity-60 mx-auto lg:mx-0">
                Recover facts without intrusive bots or cluttered notes. Calibrated for high-performance leadership teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-2">
              <button 
                onClick={handleSignIn} 
                className="w-full sm:w-auto px-12 h-16 bg-primary text-on-primary rounded-xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-4 group ring-4 ring-primary/10"
              >
                Get Started <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3 px-4 py-2 opacity-40 shrink-0">
                 <ShieldCheck size={18} className="text-success" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Vault Active</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-6 pt-10 border-t border-outline-variant/10">
              <HeroStat value="Direct" label="Audio Capture" />
              <HeroStat value="Zero" label="Meeting Bots" />
              <HeroStat value="Private" label="Personal Vault" />
            </div>
          </div>

          {/* ILLUSTRATION COLUMN */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center animate-fade-in [animation-delay:200ms]">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
               
               {/* The Prism (Processing Core) */}
               <div className="relative z-20 w-48 h-64 bg-surface-container-low border-2 border-on-surface rounded-[2.5rem] shadow-[24px_24px_0px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-8 transform -rotate-3 transition-transform hover:rotate-0 duration-700 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]" />
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/20 group-hover:scale-110 transition-transform">
                     <Activity size={28} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-4 w-full px-8">
                     <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
                     </div>
                     <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-on-surface">
                        <span>Analyzing</span>
                        <span className="text-primary font-mono">LIVE</span>
                     </div>
                  </div>
               </div>

               {/* The Signal (Right Output) */}
               <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 z-30 scale-90">
                  <div className="bg-surface border-2 border-on-surface rounded-3xl p-6 shadow-2xl w-56 space-y-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-success text-on-primary rounded-lg flex items-center justify-center shadow-lg">
                           <ShieldCheck size={14} strokeWidth={3} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">Recap Secured</span>
                     </div>
                     <div className="space-y-3">
                        <div className="h-2 w-full bg-surface-container-highest rounded-full" />
                        <div className="h-2 w-3/4 bg-surface-container-highest rounded-full" />
                        <div className="h-2 w-1/2 bg-surface-container-highest rounded-full opacity-40" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};