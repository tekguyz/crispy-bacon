
import React from 'react';
import { ChevronRight, Terminal, Cpu, ShieldCheck, Radio, Globe, Database, Zap } from 'lucide-react';

const MANUAL_DATA = [
  {
    q: "Direct Loopback Technology",
    a: "Bacon utilizes the OS-level system audio loop. Unlike meeting bots, we capture the raw audio buffer directly from your output device. This ensures 100% privacy and zero 'extra participant' friction in professional calls.",
    icon: Radio
  },
  {
    q: "Neural Grounding (Strategic Trace)",
    a: "Every highlight generated is traced back to the original signal buffer. The reasoning engine is prohibited from creative interpolation. If a decision wasn't made, it reports a 'Logic Gap' rather than a guess.",
    icon: ShieldCheck
  },
  {
    q: "The Google Workspace Bridge",
    a: "Our Bridge protocol uses read-only OAuth scopes to sync your Calendar and Drive. It pulls context—not files—to ground the reasoning engine in your current project trajectory.",
    icon: Zap
  },
  {
    q: "Hardware Thresholds",
    a: "Standard Modules are optimized for 15m rapid-capture. Executive Modules utilize high-memory Gemini 3.0 Pro models to process 60m sessions with deep strategic nuance.",
    icon: Cpu
  },
  {
    q: "Air-Gapped Privacy Standard",
    a: "Data is strictly partitioned at the Row Level (RLS). We do not train general models on user nodes. Your research vault is encrypted with AES-256 and isolated from the public web.",
    icon: Database
  },
  {
    q: "Signal Export Protocol",
    a: "All recaps are exported as standard Markdown (.md). We prioritize structural compatibility with Obsidian, Notion, and specialized research dossiers.",
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
                <Terminal size={14} strokeWidth={3} />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">System Manual v2.5</span>
             </div>
             <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none italic">Technical <br/><span className="text-primary not-italic">Specs.</span></h2>
             <p className="text-lg font-medium text-on-surface-variant opacity-60 leading-tight max-w-sm font-serif">
                Operational parameters and the architectural constraints of the Crispy Bacon instrument.
             </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {MANUAL_DATA.map((item, i) => (
              <div key={i} className="space-y-5 group border-l-2 border-outline-variant/10 pl-8 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-inner border border-outline-variant/10 group-hover:scale-110 transition-transform">
                    <item.icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[8px] font-mono font-black text-on-surface-variant/30 uppercase tracking-[0.4em]">Section 0{i+1}</span>
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
