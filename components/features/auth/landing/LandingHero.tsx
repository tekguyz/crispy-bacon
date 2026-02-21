
import React from 'react';
import { ArrowRight, Star, Mic, Play, Radio } from 'lucide-react';
import { triggerHaptic } from '../../../../services/hapticService';
import { HeroStat } from './HeroStat';

export const LandingHero: React.FC<any> = ({ onSignIn }) => {
  const handleSignIn = () => {
    triggerHaptic('medium');
    onSignIn();
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-background bg-grain border-b border-outline-variant/10">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none text-on-surface" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-surface-container-highest/30 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/4" />

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left: Typography & Action */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-12">
            
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-surface-container-low/50 backdrop-blur-md shadow-sm animate-fade-in cursor-default hover:border-primary/40 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-primary">Ready</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl xl:text-9xl font-display font-black tracking-tighter leading-[0.85] text-on-surface uppercase animate-slide-up">
                Noisy World. <br />
                <span className="text-primary italic">Clear Signal.</span>
              </h1>
              <p className="text-xl md:text-2xl font-serif font-medium text-on-surface-variant opacity-70 max-w-2xl leading-relaxed animate-slide-up [animation-delay:100ms]">
                The professional research instrument for high-performance leaders. 
                Turn long meetings into clear, organized notes without the bots.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-slide-up [animation-delay:200ms]">
              <button 
                onClick={handleSignIn} 
                className="w-full sm:w-auto px-10 h-16 bg-primary text-on-primary rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95 transition-all flex items-center justify-center gap-4 group border border-white/10"
              >
                Start Recording 
                <div className="w-6 h-6 rounded-full bg-on-primary/20 flex items-center justify-center group-hover:bg-on-primary/30 transition-colors">
                   <ArrowRight size={12} strokeWidth={3} />
                </div>
              </button>
              
              <button 
                onClick={handleSignIn}
                className="flex items-center gap-4 text-[10px] font-black text-on-surface uppercase tracking-widest hover:text-primary transition-colors group px-6 h-16"
              >
                <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center group-hover:border-primary/50 transition-colors bg-surface-container-low shadow-sm">
                   <Play size={12} fill="currentColor" className="ml-0.5" />
                </div>
                See How It Works
              </button>
            </div>

            <div className="pt-12 border-t border-outline-variant/10 w-full animate-slide-up [animation-delay:300ms]">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 <HeroStat value="Zero" label="Meeting Bots" />
                 <HeroStat value="100%" label="Secure Storage" />
                 <HeroStat value="AES-256" label="Encryption" />
                 <HeroStat value="24/7" label="Always On" />
               </div>
            </div>
          </div>

          {/* Right: Abstract Visual */}
          <div className="lg:col-span-5 relative hidden lg:block animate-fade-in [animation-delay:400ms]">
             <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Abstract Interface Composition */}
                <div className="absolute inset-0 bg-surface-container-low rounded-[3rem] border border-outline-variant/10 shadow-2xl rotate-3 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 ledger-grid opacity-[0.05]" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                   
                   <div className="relative z-10 flex flex-col items-center gap-8 p-8">
                      <div className="w-24 h-24 bg-surface-container-high rounded-3xl flex items-center justify-center shadow-inner border border-outline-variant/10 text-primary">
                         <Mic size={48} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-4 text-center">
                         <div className="h-2 w-32 bg-on-surface/10 rounded-full mx-auto" />
                         <div className="h-2 w-24 bg-on-surface/5 rounded-full mx-auto" />
                      </div>
                      <div className="flex gap-2">
                         {[1, 1.2, 0.8, 1.5, 1.1].map((h, i) => (
                            <div key={i} className="w-1.5 bg-primary rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: `${h * 20}px`, animationDelay: `${i * 0.1}s` }} />
                         ))}
                      </div>
                   </div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -bottom-8 -left-8 bg-surface-container border border-outline-variant/10 p-6 rounded-3xl shadow-xl -rotate-2 w-64 backdrop-blur-md">
                   <div className="flex items-center gap-3 mb-4">
                      <Star size={14} className="text-primary" fill="currentColor" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface">Insight Ready</span>
                   </div>
                   <div className="space-y-2.5">
                      <div className="h-1.5 w-full bg-on-surface/10 rounded-full" />
                      <div className="h-1.5 w-3/4 bg-on-surface/10 rounded-full" />
                   </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -top-4 -right-4 bg-on-surface text-surface p-5 rounded-3xl shadow-xl rotate-6 border border-on-surface/10">
                   <Radio size={24} className="animate-pulse" />
                </div>
             </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 10px; opacity: 0.5; }
          50% { height: 30px; opacity: 1; }
        }
      `}</style>
    </section>
  );
};
