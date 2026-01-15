
import React from 'react';
import { ArrowLeft, Lock, ShieldCheck, EyeOff, Database, Radio } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { AppView } from '../../../types';
import { BaconBrand } from '../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../constants/version';

export default function PrivacyPage() {
  const { setView } = useAppStore();

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 z-50 flex items-center justify-between px-6 md:px-12">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="hover:opacity-80 transition-opacity"
        >
          <BaconBrand className="scale-75 md:scale-90 origin-left" />
        </button>
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Exit
        </button>
      </nav>

      <main className="pt-32 pb-40 px-6 md:px-12 max-w-4xl mx-auto space-y-16 animate-fade-in">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/10">
              <EyeOff size={14} /> Data Privacy
            </div>
            <div className="text-[9px] font-mono font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">
              Clear Policy
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-slab font-bold tracking-tighter leading-none uppercase text-on-surface">Our <br/><span className="text-primary">Privacy Standards</span></h1>
          <p className="text-on-surface-variant opacity-60 font-bold uppercase tracking-widest text-[10px]">Updated January {COPYRIGHT_YEAR}</p>
        </header>

        <section className="space-y-12">
          <div className="bg-surface-container-low p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Lock size={160} />
            </div>
            <h2 className="text-2xl font-slab font-bold tracking-tight flex items-center gap-3 relative z-10 text-on-surface uppercase">
              1. Your Privacy is Permanent
            </h2>
            <p className="text-lg md:text-xl font-serif leading-relaxed opacity-80 relative z-10 text-on-surface-variant">
              We treat your research and notes as confidential by default. Your content is protected by industry-standard security measures. We never share your notes or sell your data to third parties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 bg-surface-container rounded-[2rem] border border-outline-variant/5 space-y-4 hover:border-primary/20 transition-all group">
                <div className="p-2 bg-primary/10 text-primary w-fit rounded-lg shadow-inner group-hover:scale-110 transition-transform">
                  <Database size={20} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Secure Storage</h3>
                <p className="text-sm opacity-70 leading-relaxed font-medium text-on-surface-variant">
                  Your notes and recordings are stored in a secure cloud environment. We prioritize isolation, ensuring that only you can access your own research library.
                </p>
             </div>
             <div className="p-8 bg-surface-container rounded-[2rem] border border-outline-variant/5 space-y-4 hover:border-primary/20 transition-all group">
                <div className="p-2 bg-primary/10 text-primary w-fit rounded-lg shadow-inner group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Assistant Privacy</h3>
                <p className="text-sm opacity-70 leading-relaxed font-medium text-on-surface-variant">
                  When you chat with the assistant, it only uses your notes to provide answers. We do not use these conversations to train general AI models.
                </p>
             </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-outline-variant/10">
            <h2 className="text-xl font-slab font-bold uppercase tracking-tight text-on-surface">2. Complete Control</h2>
            <p className="font-serif text-lg leading-relaxed opacity-70 text-on-surface-variant">
              You are in control of your data. You can delete specific notes or clear your entire history at any time through the application settings. When you delete content, it is removed from our systems.
            </p>
          </div>

          <div className="bg-surface-container-highest/10 p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 text-center">
             <p className="text-xs font-bold opacity-40 uppercase tracking-widest text-on-surface-variant mb-4">Privacy Questions?</p>
             <a href="mailto:privacy@crispybacon.ai" className="text-primary font-black uppercase tracking-widest text-sm hover:underline">privacy@crispybacon.ai</a>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em] border-t border-outline-variant/5 text-on-surface-variant">
         &copy; {COPYRIGHT_YEAR} Crispy Bacon Labs
      </footer>
    </div>
  );
}
