import React from 'react';
import { ArrowLeft, Sparkles, Zap, Brain, Target, Activity, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { AppView } from '../../../types';
import { BaconBrand } from '../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../constants/version';

export default function EthicsPage() {
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
              <Sparkles size={14} /> Our Principles
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-slab font-bold tracking-tighter leading-none uppercase text-on-surface">Intelligence <br/><span className="text-primary">with Integrity</span></h1>
          <p className="text-on-surface-variant opacity-60 font-bold uppercase tracking-widest text-[10px]">Principles of Truth & Clarity</p>
        </header>

        <section className="space-y-12">
          <div className="bg-surface-container-low p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Brain size={160} />
            </div>
            <h2 className="text-2xl font-slab font-bold tracking-tight relative z-10 uppercase text-on-surface">A Helpful Partner</h2>
            <p className="text-lg md:text-2xl font-serif leading-relaxed opacity-80 relative z-10 text-on-surface-variant">
              We believe AI should be a partner that saves you time. Our assistant is designed to be truthful, efficient, and direct—helping you find the information you need without unnecessary complexity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 relative z-10">
               <div className="space-y-3 p-6 bg-background rounded-2xl shadow-sm border border-outline-variant/5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner"><Zap size={20} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Clarity</p>
                  <p className="text-[9px] font-bold opacity-50 uppercase text-on-surface-variant">No filler or jargon</p>
               </div>
               <div className="space-y-3 p-6 bg-background rounded-2xl shadow-sm border border-outline-variant/5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner"><Target size={20} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Accuracy</p>
                  <p className="text-[9px] font-bold opacity-50 uppercase text-on-surface-variant">Factual and evidence-based</p>
               </div>
               <div className="space-y-3 p-6 bg-background rounded-2xl shadow-sm border border-outline-variant/5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner"><ShieldCheck size={20} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Control</p>
                  <p className="text-[9px] font-bold opacity-50 uppercase text-on-surface-variant">You own your history</p>
               </div>
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-outline-variant/10">
            <h2 className="text-xl font-slab font-bold uppercase tracking-widest text-primary flex items-center gap-3">
               1. Evidence First
            </h2>
            <p className="font-serif text-lg leading-relaxed opacity-70 text-on-surface-variant">
              Our models are instructed to prioritize the facts within your documents and recordings. If a detail is missing, the assistant is trained to be honest rather than guessing.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-slab font-bold uppercase tracking-widest text-primary flex items-center gap-3">
               2. Privacy as a Standard
            </h2>
            <p className="font-serif text-lg leading-relaxed opacity-70 text-on-surface-variant">
              We never use your private notes to train public AI models. Your workspace is isolated, and your research remains yours alone.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em] border-t border-outline-variant/5 text-on-surface-variant">
         &copy; {COPYRIGHT_YEAR} Crispy Bacon Labs
      </footer>
    </div>
  );
}