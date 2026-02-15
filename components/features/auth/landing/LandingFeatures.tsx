
import React from 'react';
import { ShieldCheck, Brain, Cloud, Database, Lock, Zap } from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  const features = [
    {
      title: "Works Offline",
      desc: "Your recordings are saved to your device immediately. Safe saving, even if your connection drops.",
      icon: Database
    },
    {
      title: "Advanced AI",
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
    <section id="features" className="py-24 bg-background border-b border-outline-variant/10">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
           <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none mb-4">
                Research <br/><span className="text-primary italic">Capabilities.</span>
              </h2>
              <p className="text-sm font-medium text-on-surface-variant opacity-60 uppercase tracking-widest max-w-lg">
                Built for the rigorous demands of professional analysts and executives.
              </p>
           </div>
           <div className="h-px bg-outline-variant/20 flex-1 mb-2 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
           {features.map((feat, i) => (
             <div key={i} className="flex gap-5 group">
                <div className="shrink-0 mt-1">
                   <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <feat.icon size={18} strokeWidth={2} />
                   </div>
                </div>
                <div className="space-y-2">
                   <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">{feat.title}</h3>
                   <p className="text-[13px] font-medium text-on-surface-variant opacity-60 leading-relaxed">
                      {feat.desc}
                   </p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
