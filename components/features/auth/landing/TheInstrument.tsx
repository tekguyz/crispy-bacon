import React from 'react';
import { Mic, Search, CheckSquare, Radio, Globe, Cpu, ArrowRight } from 'lucide-react';

export const TheInstrument: React.FC = () => {
  const signalPath = [
    {
      id: "01",
      tag: "INPUT",
      title: "Direct Capture",
      desc: "Record system audio from Zoom or Meet. No bots, just pure signal.",
      icon: Radio,
      specs: ["ZERO BOTS", "PRIVACY FIRST"]
    },
    {
      id: "02",
      tag: "PROCESS",
      title: "Deep Reasoning",
      desc: "Our engine separates fact from filler, identifying decisions automatically.",
      icon: Search,
      specs: ["FACT CHECKED", "HIGH DENSITY"]
    },
    {
      id: "03",
      tag: "OUTPUT",
      title: "Ask Voice",
      desc: "Don't just read notes. Interrogate them with natural voice follow-ups.",
      icon: Cpu,
      specs: ["INSTANT ANSWERS", "PRO LOGIC"]
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-surface-container-lowest border-y-2 border-outline-variant relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid pointer-events-none opacity-[0.03]" />
      
      <div className="container-landing relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end mb-20">
           <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 text-primary rounded-full">
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">The Signal Path</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-on-surface uppercase leading-[0.85] italic">
                The <span className="text-primary not-italic text-outline">Instrument.</span>
              </h2>
           </div>
           <div className="lg:col-span-4 pb-2">
              <p className="text-lg font-medium text-on-surface-variant opacity-60 leading-tight border-l-2 border-primary/20 pl-6">
                A mechanical reasoning engine built for professional research output. No fluff, just facts.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-outline-variant/10 rounded-[2.5rem] overflow-hidden border border-outline-variant shadow-2xl">
          {signalPath.map((step) => (
            <div key={step.id} className="bg-background p-10 space-y-10 group hover:bg-surface-container-low transition-all duration-500">
               <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                     <step.icon size={28} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-mono font-black text-on-surface-variant opacity-20 tracking-[0.4em]">{step.id}</span>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-primary uppercase tracking-[0.3em] block">{step.tag}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface leading-none">{step.title}</h3>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant opacity-70 leading-relaxed min-h-[4rem]">
                    {step.desc}
                  </p>
               </div>

               <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/10">
                  {step.specs.map((s, i) => (
                    <span key={i} className="text-[8px] font-mono font-bold uppercase tracking-widest text-on-surface opacity-30 group-hover:opacity-100 transition-opacity">
                      {s}
                    </span>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};