import React from 'react';
import { ChevronRight, Terminal, Cpu, ShieldCheck, Radio, Globe, Database, Zap, BookOpen } from 'lucide-react';

const MANUAL_DATA = [
  {
    q: "Direct Audio Capture",
    a: "Bacon records audio directly from your computer's system output. Unlike meeting bots, we don't join the call or display an avatar. It's just you and your notes.",
    icon: Radio
  },
  {
    q: "Fact-Based Summaries",
    a: "Every highlight generated is checked against the original recording. The assistant is instructed not to guess. If a decision wasn't made, it won't invent one.",
    icon: ShieldCheck
  },
  {
    q: "Google Workspace Sync",
    a: "Connect your Calendar and Drive to let the assistant understand your schedule and import existing documents for analysis.",
    icon: Zap
  },
  {
    q: "Model Intelligence",
    a: "Standard accounts use fast models for quick 15-minute recaps. Executive accounts use advanced reasoning models capable of handling hour-long strategy sessions.",
    icon: Cpu
  },
  {
    q: "Private & Secure",
    a: "Your data is isolated. We do not train general AI models on your private notes. Your research is encrypted and stored securely.",
    icon: Database
  },
  {
    q: "Export Options",
    a: "All recaps can be exported as standard Markdown (.md) or copied directly to Notion and Obsidian.",
    icon: Globe
  }
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 md:py-40 bg-surface-container-lowest border-y-2 border-outline-variant relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid pointer-events-none opacity-[0.03]" />
      
      <div className="container-landing relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-4 space-y-8">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 border border-primary/10 text-primary rounded-full">
                <BookOpen size={14} strokeWidth={3} />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Documentation</span>
             </div>
             <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none italic">How it <br/><span className="text-primary not-italic">Works.</span></h2>
             <p className="text-lg font-medium text-on-surface-variant opacity-60 leading-tight max-w-sm font-serif">
                Common questions about privacy, security, and how the assistant processes your data.
             </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {MANUAL_DATA.map((item, i) => (
              <div key={i} className="space-y-5 group border-l-2 border-outline-variant/10 pl-8 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-inner border border-outline-variant/10 group-hover:scale-110 transition-transform">
                    <item.icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[8px] font-mono font-black text-on-surface-variant/30 uppercase tracking-[0.4em]">0{i+1}</span>
                </div>
                <div className="space-y-3">
                   <h3 className="text-xl font-black uppercase tracking-tight text-on-surface leading-tight">{item.q}</h3>
                   <p className="text-[13px] font-medium text-on-surface-variant opacity-70 leading-relaxed">
                      {item.a}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};