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
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
      
      <div className="container-landing relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* COPY COLUMN */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 border border-primary/10 text-primary rounded-full">
              <Sparkles size={12} strokeWidth={3} />
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">Professional Research Assistant</span>
            </div>

            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-[6.5rem] font-display font-bold tracking-tighter leading-[0.82] text-on-background text-balance uppercase italic">
                Distill signal <br /> 
                <span className="text-primary not-italic">from noise.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-background font-medium font-serif leading-relaxed max-w-xl opacity-60 mx-auto lg:mx-0">
                Recover facts without intrusive bots or cluttered notes. Calibrated for high-performance leadership teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start pt-4">
              <button 
                onClick={handleSignIn} 
                className="w-full sm:w-auto px-12 h-16 bg-primary text-on-primary rounded-xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-4 group ring-4 ring-primary/10"
              >
                Get Started <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3 px-4 py-2 opacity-50">
                 <ShieldCheck size={20} className="text-success" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Private Vault Active</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-16 gap-y-8 pt-12 border-t border-outline-variant/10">
              <HeroStat value="Direct" label="Audio Capture" />
              <HeroStat value="Zero" label="Meeting Bots" />
              <HeroStat value="Private" label="Personal Vault" />
            </div>
          </div>

          {/* ILLUSTRATION COLUMN */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center animate-fade-in [animation-delay:200ms]">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
               
               {/* The Prism (Processing Core) */}
               <div className="relative z-20 w-52 h-72 bg-surface-container-low border-2 border-on-surface rounded-[2.5rem] shadow-[24px_24px_0px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-10 transform -rotate-3 transition-transform hover:rotate-0 duration-700 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]" />
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/20 group-hover:scale-110 transition-transform">
                     <Activity size={32} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-6 w-full px-10">
                     <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
                     </div>
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-on-surface">
                        <span>Analyzing</span>
                        <span className="text-primary font-mono">LIVE</span>
                     </div>
                  </div>
               </div>

               {/* The Signal (Right Output) */}
               <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 z-30">
                  <div className="bg-surface border-2 border-on-surface rounded-3xl p-8 shadow-2xl w-64 space-y-5 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 bg-success text-on-primary rounded-lg flex items-center justify-center shadow-lg">
                           <ShieldCheck size={16} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Recap Secured</span>
                     </div>
                     <div className="space-y-4">
                        <div className="h-2.5 w-full bg-surface-container-highest rounded-full" />
                        <div className="h-2.5 w-3/4 bg-surface-container-highest rounded-full" />
                        <div className="h-2.5 w-1/2 bg-surface-container-highest rounded-full opacity-40" />
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