
import React, { useState } from 'react';
import { 
  Sparkles, Calendar, CheckSquare, Check, Loader2, Music, 
  ShieldCheck, Zap, ChevronDown, ChevronUp, Save, 
  LayoutDashboard, Target, Clock, Activity, Quote 
} from 'lucide-react';
import { usePublicInsightLogic } from '../../hooks/usePublicInsightLogic';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { BaconLogo } from '../ui/Logo';
import { useAppStore } from '../../store/useAppStore';

const PublicShareView: React.FC = () => {
  const { 
    insight, 
    isSyncing, 
    handleToggleTask, 
    isCompleted 
  } = usePublicInsightLogic();

  const { session, importSharedInsight, setView, publicSharedInsight } = useAppStore();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!insight) return null;

  const handleImport = async () => {
    if (!publicSharedInsight) return;
    setIsImporting(true);
    await importSharedInsight(publicSharedInsight);
    setIsImporting(false);
  };

  const actionItems = insight.action_items || [];
  const activeTasks = actionItems.map((item, i) => ({ item, i })).filter(({ i }) => !isCompleted(i));
  const completedTasks = actionItems.map((item, i) => ({ item, i })).filter(({ i }) => isCompleted(i));

  // High-Density Stat Item for Summary Details
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
      
      {/* Recap Header */}
      <nav className="h-16 border-b border-outline-variant/10 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <BaconLogo className="w-7 h-7" />
          <div className="flex flex-col leading-none">
             <span className="text-sm font-black tracking-tighter text-on-surface uppercase leading-none">Crispy <span className="text-primary">Bacon</span></span>
             <span className="text-[7px] font-mono font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-20 mt-1">Research Entry</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {isSyncing && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10 animate-fade-in">
                <Loader2 size={10} className="animate-spin text-primary" />
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Updating</span>
             </div>
           )}

           {session ? (
              <button 
                onClick={() => setView('DASHBOARD' as any)}
                className="flex items-center gap-2 px-4 h-9 bg-surface-container-high text-on-surface rounded-xl font-black text-[9px] uppercase tracking-widest hover:text-primary transition-all active:scale-95"
              >
                <LayoutDashboard size={14} strokeWidth={2.5} />
                <span className="hidden sm:inline">My Library</span>
              </button>
           ) : (
             <button 
                onClick={handleImport}
                className="px-6 h-10 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all"
             >
                Start My Library
             </button>
           )}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-24">
          
          {/* Summary Ribbon */}
          <header className="space-y-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-6 border-b border-outline-variant/10 mb-12">
               <StatItem 
                  icon={Calendar} 
                  value={new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                  label="Date" 
               />
               <StatItem 
                  icon={Activity} 
                  value={insight.sentiment || 'NEUTRAL'} 
                  label="Tone" 
               />
               <StatItem 
                  icon={Clock} 
                  value="1m" 
                  label="Quick Read" 
               />
               <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/5 text-success rounded-lg border border-success/10">
                  <ShieldCheck size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Note</span>
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
                  <audio controls src={insight.audio_url} className="flex-1 h-8 accent-primary custom-audio-player-slim" />
              </div>
            )}
          </header>

          {/* Primary Section: Clear Thinking */}
          <section className="relative">
            <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-2 bg-primary opacity-10 hidden md:block rounded-full" />
            
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-primary/10 text-primary rounded-xl shadow-inner">
                  <Quote size={18} strokeWidth={3} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">The Summary</h3>
            </div>

            <div className="prose-summary">
              <MarkdownRenderer 
                content={insight.summary} 
                className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-on-surface font-medium" 
              />
            </div>
          </section>

          {/* Secondary Section: Key Points */}
          {insight.highlights && insight.highlights.length > 0 && (
             <section className="space-y-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-container-high text-primary rounded-xl border border-outline-variant/10 shadow-inner">
                    <Target size={18} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Knowledge Points</h4>
                </div>

                <div className="flex flex-col gap-6">
                  {insight.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-8 group">
                      <div className="flex flex-col items-center gap-3 shrink-0 pt-2">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-on-primary shadow-sm group-hover:shadow-lg group-hover:scale-110">
                             <span className="text-[11px] font-mono font-black text-on-surface group-hover:text-on-primary">0{i + 1}</span>
                          </div>
                          <div className="w-px h-12 bg-outline-variant/20 rounded-full group-hover:bg-primary/30 transition-colors" />
                      </div>
                      
                      <div className="flex-1 pt-1">
                          <p className="text-2xl md:text-3xl font-bold text-on-surface leading-tight tracking-tight">
                            {h}
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          )}

          {/* Tertiary Section: Next Steps */}
          {actionItems.length > 0 && (
            <section className="space-y-10 pb-20">
              <div className="flex items-center gap-3 px-1">
                <div className="p-2 bg-surface-container-high text-primary rounded-xl border border-outline-variant/10 shadow-inner">
                  <CheckSquare size={18} strokeWidth={2.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-on-surface-variant opacity-30">Next Steps</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                {activeTasks.map(({ item, i }) => (
                  <button 
                   key={i} 
                   onClick={() => handleToggleTask(i)}
                   disabled={!insight.is_collaborative || isSyncing}
                   className="w-full text-left flex items-start gap-6 p-6 rounded-3xl border transition-all group bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-high active:scale-[0.99] disabled:opacity-50"
                  >
                     <div className="mt-1 w-6 h-6 rounded-xl border-2 border-outline-variant/30 flex items-center justify-center shrink-0 group-hover:border-primary transition-all bg-background shadow-inner" />
                     <span className="text-xl font-bold text-on-surface leading-tight">{item}</span>
                  </button>
                ))}

                {completedTasks.length > 0 && (
                   <div className="mt-8 pt-8 border-t border-outline-variant/10">
                      <button 
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-on-surface transition-colors mb-6"
                      >
                         {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                         Done ({completedTasks.length})
                      </button>

                      {showCompleted && (
                        <div className="space-y-3 animate-fade-in">
                           {completedTasks.map(({ item, i }) => (
                              <button 
                                key={i} 
                                onClick={() => handleToggleTask(i)}
                                disabled={!insight.is_collaborative || isSyncing}
                                className="w-full text-left flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low/50 opacity-40 hover:opacity-100 transition-all group"
                              >
                                 <div className="mt-0.5 w-5 h-5 rounded-lg bg-success flex items-center justify-center shrink-0 shadow-inner">
                                    <Check size={12} className="text-white" strokeWidth={4} />
                                 </div>
                                 <span className="text-sm font-bold text-on-surface line-through decoration-2 decoration-on-surface-variant/20">{item}</span>
                              </button>
                           ))}
                        </div>
                      )}
                   </div>
                )}
              </div>
            </section>
          )}
          
          {/* Conversion Anchor */}
          {!session && (
            <footer className="pt-20 pb-32 text-center">
                <div className="inline-flex flex-col items-center gap-8 p-12 rounded-[3rem] bg-on-surface text-surface shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
                   <BaconLogo className="w-12 h-12 relative z-10" />
                   <div className="space-y-2 relative z-10">
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Time to think.</h4>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Establish Your Library</p>
                   </div>
                   <button onClick={handleImport} className="relative z-10 px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                      Keep this Recap
                   </button>
                </div>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicShareView;
