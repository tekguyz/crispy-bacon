
import React from 'react';
import { Cpu, ShieldCheck, Database, Globe, HardDrive, Server, Lock, Terminal, Box } from 'lucide-react';

export const SpecsSection: React.FC = () => {
  const sections = [
    {
      title: "Assistant Logic",
      icon: Cpu,
      content: "We use professional-grade reasoning to understand your notes. Our assistant handles long conversations and complex documents by finding the core facts and decisions automatically.",
      specs: ["High Memory", "Expert Summaries", "Fact-Based Only"]
    },
    {
      title: "Data Storage",
      icon: Database,
      content: "Your library is stored in a private vault. We use advanced security measures to ensure that only you can access your work. Your notes are isolated and strictly confidential.",
      specs: ["Private Accounts", "Secure Database", "Strict Privacy"]
    },
    {
      title: "Audio Security",
      icon: HardDrive,
      content: "Original recordings are stored in an encrypted environment. We use temporary access links that expire quickly to keep your source material safe from unauthorized access.",
      specs: ["Encrypted Files", "Private Access", "Secure Links"]
    },
    {
      title: "Privacy First",
      icon: Server,
      content: "All analysis is done in a secure cloud environment. We prioritize the privacy of your data during the recap process and never use your notes to train general models.",
      specs: ["Private Recap", "Isolated Process", "No AI Training"]
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-4xl">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Terminal size={24} className="text-brand-primary" />
          <h2 className="text-3xl font-black font-display uppercase tracking-tighter">How Bacon Works</h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest px-1">
          <span>SECURE SESSION</span>
          <div className="w-1 h-1 rounded-full bg-brand-primary" />
          <span>STATUS: ONLINE</span>
          <div className="w-1 h-1 rounded-full bg-brand-primary" />
          <span>ENCRYPTION: ACTIVE</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 md:p-12 space-y-8 hover:border-brand-primary/20 transition-all group">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-surface-container-high text-on-surface-variant rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                   <s.icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-on-surface">{s.title}</h3>
             </div>
             
             <p className="text-base md:text-lg font-serif text-on-surface-variant leading-relaxed opacity-80">
                {s.content}
             </p>

             <div className="flex flex-wrap gap-2 pt-4">
                {s.specs.map((spec, idx) => (
                   <div key={idx} className="px-4 py-2 bg-background border border-outline-variant/10 rounded-xl flex items-center gap-3 group-hover:border-brand-primary/30 transition-colors">
                      <Box size={10} className="text-brand-primary opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{spec}</span>
                   </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      <footer className="bg-foreground text-background p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck size={140} />
         </div>
         <div className="space-y-3 text-center md:text-left relative z-10">
            <h4 className="text-2xl font-black font-display uppercase tracking-tight">Your Data is Yours.</h4>
            <p className="text-[11px] font-bold opacity-60 uppercase tracking-[0.2em] max-w-md leading-relaxed">
               We prioritize your privacy above all else. Your notes are isolated, encrypted, and never shared with anyone.
            </p>
         </div>
         <button className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10 shadow-xl shadow-brand-primary/20">
            Read Our Ethics
         </button>
      </footer>
    </div>
  );
};
