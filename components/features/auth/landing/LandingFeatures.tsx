
import React from 'react';
import { ShieldCheck, Brain, Cloud, Database, Lock, Zap, ArrowRight } from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  const features = [
    {
      title: "Works Offline",
      desc: "Your recordings are saved to your device immediately. Safe saving, even if your connection drops.",
      icon: Database
    },
    {
      title: "Advanced Reasoning",
      desc: "Powered by Google's most advanced model for detailed thinking and complex queries.",
      icon: Brain
    },
    {
      title: "Private Accounts",
      desc: "Strict account privacy ensures your data is isolated. We never train on your notes.",
      icon: Lock
    },
    {
      title: "Cloud Backup",
      desc: "Seamlessly backup your library to the cloud when you choose. Access your notes from any device.",
      icon: Cloud
    },
    {
      title: "Fast Performance",
      desc: "Built on a modern engine for instant load times and fluid interaction. No spinners, no waiting.",
      icon: Zap
    },
    {
      title: "Fact Checking",
      desc: "Every claim in a summary is traced back to the source audio. Trust your notes implicitly.",
      icon: ShieldCheck
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-background border-b border-outline-variant/10 relative">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* V2 Header Anatomy */}
        <div className="mb-20 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase text-on-surface leading-[0.9]">
                Research <span className="text-primary italic">Engine.</span>
            </h2>
            <p className="mt-8 text-xl font-serif font-medium text-on-surface-variant opacity-60 max-w-2xl leading-relaxed">
               Built for the rigorous demands of professional analysts. Speed, privacy, and truth are the default settings.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feat, i) => (
             <div key={i} className="group relative p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover:text-on-primary group-hover:bg-primary transition-colors shadow-inner mb-6">
                       <feat.icon size={20} strokeWidth={2} aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-xl font-slab font-bold uppercase tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">
                       {feat.desc}
                    </p>
                    
                    <div className="mt-auto pt-6 flex items-center gap-2 text-[9px] font-mono font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                       <ArrowRight size={12} strokeWidth={3} aria-hidden="true" /> Learn More
                    </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
