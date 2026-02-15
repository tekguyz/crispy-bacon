
import React from 'react';
import { Search, Radio, Cpu, ArrowRight, Activity } from 'lucide-react';

export const TheInstrument: React.FC = () => {
  const signalPath = [
    {
      id: "01",
      tag: "Input",
      title: "Direct Capture",
      desc: "System loopback recording. No bots, no avatars, just high-fidelity audio captured directly from your device hardware.",
      icon: Radio,
    },
    {
      id: "02",
      tag: "Process",
      title: "Reasoning Engine",
      desc: "Deep analysis extracts facts, decisions, and action items. We map every claim back to the original timestamp.",
      icon: Activity,
    },
    {
      id: "03",
      tag: "Output",
      title: "Knowledge Base",
      desc: "Don't just read summaries. Chat with your notes to find specific details instantly.",
      icon: Cpu,
    }
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-surface-container-low relative overflow-hidden border-b border-outline-variant/10">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
      
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 md:mb-32 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">The Architecture</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase text-on-surface leading-[0.9] animate-slide-up">
                From Raw Noise <br/> to <span className="text-primary italic">Clear Signal.</span>
            </h2>
        </div>

        {/* Process Cards */}
        <div className="relative">
             {/* Desktop Connecting Line */}
             <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent z-0" />

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {signalPath.map((step, i) => (
                   <div key={step.id} className="relative group">
                      
                      {/* Mobile Connector */}
                      {i !== signalPath.length - 1 && (
                          <div className="md:hidden absolute left-8 bottom-[-40px] h-10 w-px bg-outline-variant/20 z-0" />
                      )}

                      <div className="relative z-10 h-full bg-background border border-outline-variant/10 rounded-[2.5rem] p-8 md:p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 hover:bg-surface-container-lowest flex flex-col">
                          
                          {/* Icon Header */}
                          <div className="flex justify-between items-start mb-10">
                              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary group-hover:text-on-primary">
                                  <step.icon size={32} strokeWidth={1.5} />
                              </div>
                              <span className="text-[10px] font-mono font-black text-on-surface-variant/20 group-hover:text-primary/40 transition-colors">
                                  {step.id}
                              </span>
                          </div>

                          {/* Text Content */}
                          <div className="space-y-4 mt-auto">
                              <div className="space-y-2">
                                  <span className="inline-block px-2 py-1 rounded-md bg-surface-container-high text-[8px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                      {step.tag}
                                  </span>
                                  <h3 className="text-2xl font-slab font-bold text-on-surface leading-none group-hover:text-primary transition-colors">
                                      {step.title}
                                  </h3>
                              </div>
                              <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">
                                  {step.desc}
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
