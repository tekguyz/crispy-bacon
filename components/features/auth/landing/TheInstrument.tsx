
import React from 'react';
import { Search, Radio, Cpu } from 'lucide-react';

export const TheInstrument: React.FC = () => {
  const signalPath = [
    {
      id: "01",
      tag: "CAPTURE",
      title: "Direct Audio",
      desc: "Record system audio from Zoom, Teams, or Meet. No bots, no avatars, just pure signal.",
      icon: Radio,
    },
    {
      id: "02",
      tag: "REFINE",
      title: "Fact Check",
      desc: "Our engine separates fact from filler. Highlights are grounded in the source text, not hallucinated.",
      icon: Search,
    },
    {
      id: "03",
      tag: "QUERY",
      title: "Voice Logic",
      desc: "Don't just read notes. Ask them questions. Our voice assistant helps you find details instantly.",
      icon: Cpu,
    }
  ];

  return (
    <section className="py-24 bg-surface-container-lowest border-y border-outline-variant/10 relative overflow-hidden">
      <div className="container-landing relative z-10">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
           <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none mb-4">
             The <span className="text-primary italic">Method.</span>
           </h2>
           <p className="text-sm font-medium text-on-surface-variant opacity-60 uppercase tracking-widest">
             From raw noise to refined intelligence in three steps.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signalPath.map((step) => (
            <div key={step.id} className="p-8 border border-outline-variant/20 rounded-3xl bg-background hover:border-primary/30 transition-colors group">
               <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                     <step.icon size={24} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-mono font-black text-on-surface-variant opacity-20 tracking-[0.3em]">{step.id}</span>
               </div>

               <div className="space-y-4">
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{step.tag}</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-on-surface">{step.title}</h3>
                  <p className="text-sm font-medium text-on-surface-variant opacity-70 leading-relaxed">
                    {step.desc}
                  </p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
