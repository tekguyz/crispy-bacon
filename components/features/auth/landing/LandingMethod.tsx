
import React from 'react';
import { Mic, Search, CheckSquare, Activity } from 'lucide-react';

export const LandingMethod: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Direct Capture",
      tag: "INPUT",
      desc: "Record system audio from Zoom, Meet, or Teams. Pure signal, zero bots invited.",
      icon: Mic
    },
    {
      id: "02",
      title: "Reasoning",
      tag: "PROCESS",
      desc: "The engine separates fact from filler, identifying decisions and hard constraints automatically.",
      icon: Search
    },
    {
      id: "03",
      title: "Strategic Recap",
      tag: "OUTPUT",
      desc: "Receive a structured brief with timelines, action items, and follow-ups ready for export.",
      icon: CheckSquare
    }
  ];

  return (
    <section id="process" className="py-24 md:py-40 section-zebra-2 border-y-2 border-outline-variant relative overflow-hidden bg-surface-container-lowest">
      <div className="absolute inset-0 ledger-grid pointer-events-none opacity-[0.03]" />
      
      <div className="container-landing relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
           <div className="lg:col-span-4 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 text-primary rounded-full">
                  <Activity size={10} strokeWidth={3} />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Operational Flow</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-on-surface leading-none uppercase italic">
                Recap <span className="text-primary not-italic">First.</span>
              </h2>
              <p className="text-lg md:text-xl font-medium text-on-surface-variant opacity-60 leading-tight">
                Banish the filler. A mechanical reasoning engine calibrated for professional research output.
              </p>
           </div>

           <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div key={step.id} className="bg-surface border-2 border-outline p-8 rounded-[2rem] space-y-6 shadow-m3-1 hover:translate-y-[-4px] transition-all duration-500 group relative overflow-hidden flex flex-col">
                   <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
                   <div className="flex justify-between items-start relative z-10">
                      <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-primary shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                         <step.icon size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-mono font-black text-on-surface-variant opacity-20">{step.id}</span>
                   </div>
                   <div className="space-y-3 relative z-10 flex-1">
                      <span className="text-[9px] font-mono font-black text-primary uppercase tracking-[0.3em] block">{step.tag}</span>
                      <h3 className="text-xl font-black uppercase tracking-tight text-on-surface leading-none">{step.title}</h3>
                      <p className="text-sm font-medium text-on-surface-variant opacity-70 leading-relaxed">
                        {step.desc}
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
