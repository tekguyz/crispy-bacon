
import React from 'react';
import { Calendar, Music, ShieldCheck, Activity, Quote, LogIn, Save, CheckSquare } from 'lucide-react';
import { usePublicInsightLogic } from '../../hooks/usePublicInsightLogic';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { BaconLogo } from '../ui/Logo';
import { useAppStore } from '../../store/useAppStore';
import { triggerHaptic } from '../../services/hapticService';

const PublicShareView: React.FC = () => {
  const { insight } = usePublicInsightLogic();
  const { signOut, addToast } = useAppStore();

  if (!insight) return null;

  const handleSaveToLibrary = () => {
    triggerHaptic('medium');
    addToast("Sign in to save this note.", "info");
    setTimeout(() => signOut(), 1000); 
  };

  const StatItem = ({ icon: Icon, value, label }: any) => (
    <div className="flex items-center gap-2">
      <Icon size={12} className="text-primary/40" strokeWidth={3} />
      <div className="flex items-baseline gap-1">
        <span className="text-[10px] font-mono font-black text-on-surface uppercase tracking-tight">{value}</span>
        <span className="text-[8px] font-bold text-on-surface-variant opacity-30 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <nav className="h-16 border-b border-outline-variant/10 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <BaconLogo className="w-7 h-7" />
          <div className="flex flex-col leading-none">
             <span className="text-sm font-black tracking-tighter text-on-surface uppercase leading-none">Crispy <span className="text-primary">Bacon</span></span>
             <span className="text-[7px] font-mono font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-20 mt-1">Public Preview</span>
          </div>
        </div>
        <button 
          onClick={handleSaveToLibrary}
          className="flex items-center gap-2 px-5 h-9 bg-primary text-on-primary rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all active:scale-95"
        >
          <Save size={12} strokeWidth={3} />
          <span>Save to Library</span>
        </button>
      </nav>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-24">
          <header className="space-y-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-6 border-b border-outline-variant/10 mb-12">
               <StatItem 
                  icon={Calendar} 
                  value={new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                  label="Captured" 
               />
               <StatItem 
                  icon={Activity} 
                  value={insight.sentiment || 'NEUTRAL'} 
                  label="Tone" 
               />
               <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg border border-outline-variant/10">
                  <ShieldCheck size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Read Only</span>
               </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.9] uppercase text-balance">
              {insight.title}
            </h1>

            {insight.audio_url && (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-3 flex items-center gap-4 shadow-inner">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Music size={18} className="animate-pulse" />
                  </div>
                  <audio controls src={insight.audio_url} className="flex-1 h-8 accent-primary" />
              </div>
            )}
          </header>

          <section className="relative">
            <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-2 bg-primary opacity-10 hidden md:block rounded-full" />
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-primary/10 text-primary rounded-xl shadow-inner">
                  <Quote size={18} strokeWidth={3} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Executive Summary</h3>
            </div>
            <div className="prose-summary">
              <MarkdownRenderer 
                content={insight.summary} 
                className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.2] tracking-tight text-on-surface font-medium" 
              />
            </div>
          </section>

          {insight.highlights && insight.highlights.length > 0 && (
             <section className="space-y-8">
                <div className="flex flex-col gap-4">
                  {insight.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-6 group">
                      <div className="w-6 h-6 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant shrink-0 mt-1.5">
                         <span className="text-[9px] font-mono font-black">{i + 1}</span>
                      </div>
                      <p className="text-lg md:text-xl font-bold text-on-surface leading-snug tracking-tight">
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
             </section>
          )}

          {insight.action_items && insight.action_items.length > 0 && (
            <section className="space-y-10 pb-20 pt-10 border-t border-outline-variant/10">
              <div className="flex items-center gap-3 px-1">
                <div className="p-2 bg-surface-container-high text-primary rounded-xl border border-outline-variant/10 shadow-inner">
                  <CheckSquare size={18} strokeWidth={2.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Action Plan</h4>
              </div>
              <div className="flex flex-col gap-3">
                {insight.action_items.map((item, i) => {
                  const isDone = (insight.completed_indices || []).includes(i);
                  return (
                    <div 
                     key={i} 
                     className={`w-full flex items-start gap-5 p-5 rounded-3xl border transition-all ${isDone ? 'bg-surface-container/20 border-transparent opacity-60' : 'bg-surface-container-low border-outline-variant/10'}`}
                    >
                       <div className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${isDone ? 'bg-success border-success' : 'border-outline-variant/30'}`} />
                       <span className={`text-lg font-bold leading-tight ${isDone ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          
          <footer className="pt-10 pb-32 text-center">
              <div className="inline-flex flex-col items-center gap-8 p-10 md:p-14 rounded-[3rem] bg-on-surface text-surface shadow-2xl relative overflow-hidden group w-full max-w-xl">
                  <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
                  <BaconLogo className="w-16 h-16 relative z-10 text-primary" />
                  <div className="space-y-4 relative z-10 max-w-sm">
                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">Your turn to <br/>Think Clearly.</h4>
                    <p className="text-[11px] font-bold opacity-60 uppercase tracking-[0.2em] leading-relaxed">
                      Create your own private research library. Zero bots. Pure signal.
                    </p>
                  </div>
                  <button 
                    onClick={handleSaveToLibrary} 
                    className="relative z-10 px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
                  >
                    <LogIn size={16} strokeWidth={3} />
                    Create Free Account
                  </button>
              </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PublicShareView;
