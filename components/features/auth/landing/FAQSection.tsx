
import React from 'react';
import { ChevronRight, Terminal } from 'lucide-react';

const FAQ_DATA = [
  {
    q: "How does direct loopback work?",
    a: "We capture system audio directly from your OS. This allows Bacon to hear Zoom, Teams, or Browser audio without inviting external bots or third-party attendees to your session."
  },
  {
    q: "Is reasoning data air-gapped?",
    a: "Yes. Every workspace is isolated. Your research nodes and original signals are strictly private and never used for general model training."
  },
  {
    q: "What are the session thresholds?",
    a: "Standard accounts are capped at 15m per capture. Executive members have a 60m threshold and access to deep-reasoning Strategist models."
  },
  {
    q: "How accurate is the distillation?",
    a: "Accurate above all else. If a decision wasn't detected in the audio, the reasoning engine will report it as 'Unresolved' rather than guessing."
  }
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 md:py-40 bg-surface-container-lowest border-y-2 border-outline-variant">
      <div className="container-landing">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4 space-y-8">
             <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Terminal size={28} strokeWidth={2.5} />
             </div>
             <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none italic">The <br/><span className="text-primary not-italic">Manual.</span></h2>
             <p className="text-lg font-medium text-on-surface-variant opacity-60 leading-tight">Technical specifications and operational policy for the instrument.</p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="space-y-6 group">
                <div className="flex items-start gap-5">
                  <div className="mt-1 w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                    <ChevronRight size={14} strokeWidth={4} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-xl font-black uppercase tracking-tight text-on-surface leading-tight">{item.q}</h3>
                     <p className="text-[14px] font-medium text-on-surface-variant opacity-70 leading-relaxed">
                        {item.a}
                     </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
