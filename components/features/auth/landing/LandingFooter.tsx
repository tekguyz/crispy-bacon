
import React from 'react';
import { Cpu, Database, Zap, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { BaconBrand } from '../../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../../constants/version';
import { triggerHaptic } from '../../../../services/hapticService';

export const LandingFooter: React.FC<any> = ({ onPrivacy, onTerms, onEthics, onSignIn }) => {
  return (
    <footer className="border-t-2 border-outline-variant py-24 md:py-32 bg-surface-container-lowest/30">
      <div className="container-landing">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start mb-24">
          
          {/* BRAND AXIS */}
          <div className="md:col-span-4 space-y-12">
            <div className="space-y-6">
              <BaconBrand />
              <p className="text-[11px] font-bold text-on-background opacity-50 uppercase tracking-[0.25em] leading-relaxed max-w-xs">
                A mechanical reasoning instrument <br /> for high-performance leadership.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="px-4 py-2 bg-success/5 border border-success/20 rounded-xl flex items-center gap-3 w-fit shadow-inner">
                <ShieldCheck size={14} className="text-success" />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-success">Vault Secure</span>
              </div>
              <div className="flex items-center gap-2 px-1">
                 <Mail size={12} className="opacity-20" />
                 <a href="mailto:hello@crispybacon.ai" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">hello@crispybacon.ai</a>
              </div>
            </div>
          </div>
          
          {/* NAVIGATION LINKS */}
          <div className="md:col-span-5 grid grid-cols-2 gap-12 md:px-12 border-l border-outline-variant/10">
            <div className="space-y-8">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-20 text-on-background">Capabilities</span>
              <div className="space-y-5">
                {[
                  { icon: Cpu, label: 'Assistant' }, 
                  { icon: Database, label: 'Vaulting' }, 
                  { icon: Zap, label: 'Cloud Import' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 opacity-40 cursor-default hover:opacity-100 transition-opacity group">
                    <item.icon size={13} className="text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-background">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-20 text-on-background">Legal</span>
              <div className="flex flex-col gap-5">
                <button onClick={onPrivacy} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Privacy Policy</button>
                <button onClick={onTerms} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Terms of Service</button>
                <button onClick={onEthics} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">AI Ethics</button>
                <button onClick={onSignIn} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Member Entry</button>
              </div>
            </div>
          </div>

          {/* REFINED CTA MODULE (No longer a massive square) */}
          <div className="md:col-span-3">
             <div className="bg-on-surface text-surface rounded-[2rem] border border-on-surface shadow-2xl flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
                
                <div className="p-8 md:p-10 space-y-8 relative z-10">
                  <div className="space-y-3">
                    <p className="text-2xl md:text-3xl font-slab font-bold uppercase tracking-tight leading-[0.9] italic">
                      Ready to <br /><span className="text-primary not-italic">Refine?</span>
                    </p>
                    <p className="text-[9px] font-mono font-black uppercase tracking-widest opacity-30">Open your laboratory</p>
                  </div>

                  <button 
                    onClick={() => { triggerHaptic('medium'); onSignIn(); }}
                    className="w-full py-4 bg-primary text-on-primary rounded-xl font-black text-[11px] uppercase tracking-[0.3em] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Join Now <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>

                <div className="h-1 bg-primary/20 w-full" />
             </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-mono font-black uppercase tracking-[0.5em] opacity-20 text-on-background">
            &copy; {COPYRIGHT_YEAR} CRISPY BACON LABS :: VERSION 2.5.1
          </p>
          <div className="flex gap-8 opacity-20 hover:opacity-100 transition-opacity">
             <span className="text-[7px] font-mono font-black uppercase tracking-widest">Ping: 40ms</span>
             <span className="text-[7px] font-mono font-black uppercase tracking-widest">System: Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
