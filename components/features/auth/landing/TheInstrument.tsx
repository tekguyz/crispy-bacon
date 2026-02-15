
import React from 'react';
import { Search, Radio, Cpu, ArrowRight } from 'lucide-react';

export const TheInstrument: React.FC = () => {
  const signalPath = [
    {
      id: "01",
      tag: "Input",
      title: "Record",
      desc: "System audio or manual upload.",
      icon: Radio,
    },
    {
      id: "02",
      tag: "Process",
      title: "Summarize",
      desc: "Fact-check & organize.",
      icon: Search,
    },
    {
      id: "03",
      tag: "Output",
      title: "Ask",
      desc: "Chat with your notes.",
      icon: Cpu,
    }
  ];

  return (
    <section id="process" className="py-20 bg-background border-b border-outline-variant/10 relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          
          <div className="max-w-sm">
             <h2 className="text-2xl font-display font-bold tracking-tight text-on-surface uppercase leading-none mb-3">
               The <span className="text-primary italic">Process.</span>
             </h2>
             <p className="text-xs font-medium text-on-surface-variant opacity-60 leading-relaxed">
               Three steps from messy audio to clear notes.
             </p>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-outline-variant/0 via-outline-variant/20 to-outline-variant/0" />

             {signalPath.map((step, i) => (
                <div key={step.id} className="relative group">
                   <div className="flex items-center gap-4 mb-3 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm">
                         <step.icon size={20} strokeWidth={2} />
                      </div>
                      <div className="md:hidden h-px flex-1 bg-outline-variant/10" />
                   </div>
                   
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-black text-on-surface-variant opacity-30">{step.id}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">{step.title}</span>
                      </div>
                      <p className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-relaxed">
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
