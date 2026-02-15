
import React from 'react';
import { Cpu, Database, Zap, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { BaconBrand } from '../../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../../constants/version';
import { triggerHaptic } from '../../../../services/hapticService';

export const LandingFooter: React.FC<any> = ({ onPrivacy, onTerms, onEthics, onSignIn }) => {
  return (
    <footer className="border-t-2 border-outline-variant py-20 bg-surface-container-lowest/30">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* BRAND AXIS */}
          <div className="md:col-span-4 space-y-10">
            <div className="space-y-6">
              <BaconBrand />
              <p className="text-[11px] font-bold text-on-background opacity-50 uppercase tracking-[0.25em] leading-relaxed max-w-xs">
                A professional research tool <br /> for high-performance leadership.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="px-3 py-1.5 bg-success/5 border border-success/20 rounded-lg flex items-center gap-2 w-fit shadow-inner">
                <ShieldCheck size={12} className="text-success" />
                <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-success">Secure Storage</span>
              </div>
              <div className="flex items-center gap-2 px-1">
                 <Mail size={12} className="opacity-20" />
                 <a href="mailto:hello@crispybacon.ai" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">hello@crispybacon.ai</a>
              </div>
            </div>
          </div>
          
          {/* NAVIGATION LINKS */}
          <div className="md:col-span-5 grid grid-cols-2 gap-12 md:px-12 border-l border-outline-variant/10">
            <div className="space-y-6">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-20 text-on-background">Features</span>
              <div className="space-y-4">
                {[
                  { icon: Cpu, label: 'Assistant' }, 
                  { icon: Database, label: 'Library' }, 
                  { icon: Zap, label: 'Uploads' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 opacity-40 cursor-default hover:opacity-100 transition-opacity group">
                    <item.icon size={13} className="text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-background">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-20 text-on-background">Legal</span>
              <div className="flex flex-col gap-4">
                <button onClick={onPrivacy} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Privacy Policy</button>
                <button onClick={onTerms} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Terms of Service</button>
                <button onClick={onEthics} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">AI Ethics</button>
                <button onClick={onSignIn} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-40 hover:opacity-100 text-on-background">Member Entry</button>
              </div>
            </div>
          </div>

          {/* COMPACT CTA */}
          <div className="md:col-span-3">
             <div className="bg-on-surface text-surface rounded-3xl border border-on-surface shadow-xl flex flex-col p-6 space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                  <p className="text-xl font-slab font-bold uppercase tracking-tight leading-none italic">
                    Ready to <span className="text-primary not-italic">Refine?</span>
                  </p>
                  <p className="text-[9px] font-mono font-black uppercase tracking-widest opacity-40">Start your research</p>
                </div>

                <button 
                  onClick={() => { triggerHaptic('medium'); onSignIn(); }}
                  className="w-full py-3 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.25em] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 relative z-10"
                >
                  Join Now <ArrowRight size={14} strokeWidth={3} />
                </button>
             </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-mono font-black uppercase tracking-[0.5em] opacity-20 text-on-background">
            &copy; {COPYRIGHT_YEAR} CRISPY BACON LABS :: VERSION 2.5.1
          </p>
          <div className="flex gap-8 opacity-20 hover:opacity-100 transition-opacity">
             <span className="text-[7px] font-mono font-black uppercase tracking-widest">Online</span>
             <span className="text-[7px] font-mono font-black uppercase tracking-widest">System: Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
