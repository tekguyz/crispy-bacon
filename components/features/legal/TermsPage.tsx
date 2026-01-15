
import React from 'react';
import { ArrowLeft, Scale, CheckCircle2, Shield } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { AppView } from '../../../types';
import { BaconBrand } from '../../ui/Logo';
import { COPYRIGHT_YEAR } from '../../../constants/version';

export default function TermsPage() {
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
              <Scale size={14} /> Service Agreement
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-slab font-bold tracking-tighter leading-none uppercase text-on-surface">Terms of <br/><span className="text-primary">Service</span></h1>
          <p className="text-on-surface-variant opacity-60 font-bold uppercase tracking-widest text-[10px]">Updated January {COPYRIGHT_YEAR}</p>
        </header>

        <div className="prose-legal space-y-12">
          <section className="bg-surface-container-low p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] transition-opacity">
              <Scale size={160} />
            </div>
            <h2 className="text-2xl font-slab font-bold tracking-tight flex items-center gap-3 relative z-10 text-on-surface uppercase">
               1. Acceptance of Terms
            </h2>
            <p className="text-lg md:text-xl font-serif leading-relaxed opacity-80 relative z-10 text-on-surface-variant">
              By accessing Crispy Bacon, you agree to follow these terms. We provide a professional assistant for summarizing meetings and documents. This service is intended for professionals who value clear, organized notes.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-8 bg-surface-container rounded-[2rem] border border-outline-variant/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <CheckCircle2 size={14} /> User Ownership
              </h3>
              <p className="text-sm font-medium leading-relaxed opacity-70 text-on-surface-variant">
                You retain all rights to the audio, text, and documents you provide. Crispy Bacon processes this data to generate recaps, but we claim no ownership over your original content or the resulting summaries.
              </p>
            </div>
            <div className="space-y-4 p-8 bg-surface-container rounded-[2rem] border border-outline-variant/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Shield size={14} /> Responsible Use
              </h3>
              <p className="text-sm font-medium leading-relaxed opacity-70 text-on-surface-variant">
                We expect professional behavior. Using the service to process harmful content or attempting to interfere with our security measures will result in immediate termination of access.
              </p>
            </div>
          </div>

          <section className="space-y-6 pt-12 border-t border-outline-variant/10">
            <h2 className="text-xl font-slab font-bold uppercase tracking-tight text-on-surface">2. Service Modifications</h2>
            <p className="font-serif text-lg leading-relaxed opacity-70 text-on-surface-variant">
              We are constantly improving the assistant. We reserve the right to modify features, update models, or adjust pricing with appropriate notice to our members.
            </p>
          </section>

          <div className="bg-surface-container-highest/10 p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-6">
             <p className="text-[10px] font-black opacity-40 uppercase tracking-widest text-on-surface-variant">Contact Support</p>
             <div className="flex flex-col items-center gap-2">
               <a href="mailto:hello@crispybacon.ai" className="text-primary font-black uppercase tracking-[0.2em] text-sm hover:underline">hello@crispybacon.ai</a>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em] border-t border-outline-variant/5 text-on-surface-variant">
         &copy; {COPYRIGHT_YEAR} Crispy Bacon Labs
      </footer>
    </div>
  );
}
