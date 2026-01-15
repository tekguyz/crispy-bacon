
import React from 'react';
import { Cpu, Database, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { BaconBrand } from '../../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../../constants/version';
import { triggerHaptic } from '../../../../services/hapticService';

export const LandingFooter: React.FC<any> = ({ onPrivacy, onTerms, onEthics, onSignIn }) => {
  return (
    <footer className="border-t-2 border-outline-variant py-32 bg-surface-container-lowest/50">
      <div className="container-landing">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 md:gap-8 items-start mb-32">
          <div className="md:col-span-4 space-y-10">
            <div className="space-y-6">
              <BaconBrand />
              <p className="text-[12px] font-bold text-on-background opacity-50 uppercase tracking-[0.25em] leading-relaxed max-w-xs">A professional research instrument for high-density distillation.</p>
            </div>
            <div className="px-4 py-2 bg-success/5 border border-success/20 rounded-full flex items-center gap-3 w-fit">
              <ShieldCheck size={14} className="text-success" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-success">Vault Secure</span>
            </div>
          </div>
          
          <div className="md:col-span-5 grid grid-cols-2 gap-12 md:px-12 border-l border-outline-variant/10">
            <div className="space-y-8">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-30 text-on-background">Instrument</span>
              <div className="space-y-5">
                {[{ icon: Cpu, label: 'Refiner' }, { icon: Database, label: 'Private Vault' }, { icon: Zap, label: 'Cloud Sync' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 opacity-60 cursor-default hover:opacity-100 transition-opacity">
                    <item.icon size={14} className="text-primary" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-on-background">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-30 text-on-background">Manuals</span>
              <div className="flex flex-col gap-5">
                <button onClick={onPrivacy} className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-60 text-on-background">Privacy Policy</button>
                <button onClick={onTerms} className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-60 text-on-background">Service Terms</button>
                <button onClick={onEthics} className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-60 text-on-background">Ethics Code</button>
                <button onClick={onSignIn} className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors text-left opacity-60 text-on-background">Identity Portal</button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
             <div className="p-10 bg-on-surface text-surface rounded-sheet shadow-m3-3 flex flex-col gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <p className="text-2xl font-display font-bold uppercase tracking-tight leading-none italic">Ready to <br/><span className="text-primary not-italic">Initialize?</span></p>
                  <p className="text-[10px] font-mono font-black uppercase tracking-widest opacity-40">SESSION_START_001</p>
                </div>
                <button 
                  onClick={() => { triggerHaptic('medium'); onSignIn(); }}
                  className="w-full py-5 bg-primary text-on-primary rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
                >
                  Join the Lab <ArrowRight size={18} strokeWidth={3} />
                </button>
             </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] opacity-20 text-on-background">© {COPYRIGHT_YEAR} CRISPY BACON LABS :: HANDCRAFTED FOR CLARITY</p>
          <div className="flex items-center gap-4 opacity-20">
             <div className="w-1 h-1 rounded-full bg-on-background" />
             <span className="text-[8px] font-mono font-black uppercase tracking-widest">v2.5.1_STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
