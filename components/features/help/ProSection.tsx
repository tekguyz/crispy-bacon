import React from 'react';
import { Crown, Zap, Database, Target, Clock, Radio, Check, Share2, Activity } from 'lucide-react';

interface ProSectionProps {
  onUpgrade: () => void;
}

export const ProSection: React.FC<ProSectionProps> = ({ onUpgrade }) => {
  const comparisonData = [
    { capability: "Monthly Summaries", standard: "5 per month", pro: "Unlimited", icon: Zap },
    { capability: "Session Length", standard: "15 Minutes", pro: "60 Minutes", icon: Clock },
    { capability: "Voice Assistant", standard: "Not included", pro: "Full Access", icon: Radio },
    { capability: "History Retention", standard: "7-Day History", pro: "Permanent", icon: Database },
    { capability: "Team Sync", standard: "Manual", pro: "Automatic", icon: Share2 },
    { capability: "Analysis Depth", standard: "Basic Briefing", pro: "Deep Strategist", icon: Target },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-4xl mx-auto">
      <header className="p-8 bg-primary text-on-primary rounded-[2.5rem] shadow-xl relative overflow-hidden ring-4 ring-primary/10">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown size={180} />
        </div>
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tighter leading-none uppercase">Executive Pro</h2>
          <p className="text-xs md:text-base font-bold leading-tight opacity-80">
            Professional research bandwidth. Lift the session ceiling and unlock permanent history for all your project nodes.
          </p>
        </div>
      </header>

      <section className="space-y-6">
         <div className="flex items-center gap-4 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Tier Comparison</h3>
            <div className="h-px flex-1 bg-outline-variant/10" />
         </div>

         <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-surface-container-high border-b border-outline-variant/10">
              <div className="col-span-6 p-4 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Capability</div>
              <div className="col-span-3 p-4 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 text-center">Standard</div>
              <div className="col-span-3 p-4 text-[9px] font-black uppercase tracking-widest text-primary text-center bg-primary/5">Executive Pro</div>
            </div>

            {comparisonData.map((row, i) => (
              <div key={i} className="grid grid-cols-12 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-high transition-colors group">
                <div className="col-span-6 p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant opacity-40 group-hover:text-primary group-hover:opacity-100 transition-all border border-outline-variant/5">
                      <row.icon size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-on-surface uppercase tracking-tight">{row.capability}</span>
                </div>
                <div className="col-span-3 p-4 flex items-center justify-center text-[10px] font-bold text-on-surface-variant/30">
                    {row.standard}
                </div>
                <div className="col-span-3 p-4 flex items-center justify-center text-[10px] font-black text-on-surface tracking-tight bg-primary/5">
                    <div className="flex items-center gap-2 text-primary">
                      <Check size={12} strokeWidth={4} />
                      {row.pro}
                    </div>
                </div>
              </div>
            ))}
         </div>
      </section>

      <footer className="bg-surface-container rounded-[2.5rem] p-10 border border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] transition-all group-hover:scale-110 duration-1000">
            <Activity size={140} />
         </div>
         <div className="space-y-2 text-center md:text-left relative z-10">
            <p className="text-2xl font-black font-display uppercase tracking-tighter leading-none text-on-surface">Command the Point.</p>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-50 max-w-sm">Activation removes all session limits immediately.</p>
         </div>
         <button 
          onClick={onUpgrade}
          className="px-10 py-4 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all relative z-10"
         >
            Go Neural Pro
         </button>
      </footer>
    </div>
  );
};