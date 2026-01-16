import React, { useState } from 'react';
import { Globe, Radio, Cpu, ChevronDown, ChevronUp, Lock, FileText, Share2, Activity } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { triggerHaptic } from '../../../../services/hapticService';

export const FeatureGrid: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleMore = () => {
    triggerHaptic('light');
    setShowMore(!showMore);
  };

  const secondaryFeatures = [
    { icon: Share2, title: "Smart Export", desc: "Instantly convert recaps to Notion, Obsidian, or Markdown files." },
    { icon: Lock, title: "Air-Gap Privacy", desc: "Notes are isolated and encrypted. We never train on your data." },
    { icon: FileText, title: "Multi-Source", desc: "Merge notes from links, voice memos, and document uploads." },
    { icon: Activity, title: "Progress Logs", desc: "Automated decision logs keep your team aligned across sessions." }
  ];

  return (
    <section id="features" className="relative py-24 md:py-40 section-zebra-1 overflow-hidden">
      <div className="container-landing relative z-10">
        <div className="max-w-4xl mb-24 space-y-6">
           <div className="px-4 py-1 bg-primary/5 border border-primary/10 rounded-full w-fit">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Core Capabilities</span>
           </div>
           <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-slab font-bold tracking-tighter leading-[0.8] uppercase text-on-surface">
             Impact, <span className="text-primary">Surfaced.</span>
           </h2>
           <p className="text-xl md:text-2xl text-on-surface-variant font-medium opacity-70 leading-tight max-w-2xl">
             We filter the noise so you can focus on the work. High-density facts for professional research.
           </p>
        </div>
        
        {/* CORE HERO FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <FeatureCard 
            icon={Radio} 
            domain="VOICE"
            signal="EXPERT"
            title="Meeting Recaps" 
            desc="Capture direct audio from Zoom, Teams, or Meet. We surface decisions and action items instantly without bots."
            specs={["CLEAR AUDIO", "FACT CHECKED", "ZERO BOTS"]}
          />
          <FeatureCard 
            icon={Globe} 
            domain="WEB"
            signal="HIGH DENSITY"
            title="Web Reasoning" 
            desc="Strip away ads and fluff. Paste any link to extract core research points and organized takeaways."
            specs={["LINK EXTRACTION", "SMART TAGS", "QUICK SCAN"]}
          />
          <FeatureCard 
            icon={Cpu} 
            domain="ASSISTANT"
            signal="PRO"
            title="Ask Voice" 
            desc="Ask follow-up questions verbally. Engage in a natural conversation with your research to find specific details."
            specs={["NATURAL SPEECH", "DEEP REASONING", "INSTANT ANSWERS"]}
          />
        </div>

        {/* EXPANDABLE SECONDARY FEATURES */}
        <div className="max-w-4xl mx-auto mt-16">
           <button 
             onClick={toggleMore}
             className="w-full py-6 flex items-center justify-between border-t border-b border-outline-variant group hover:bg-surface-container-low transition-all px-4"
           >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant group-hover:text-primary transition-colors">
                 Additional Capabilities
              </span>
              <div className="p-2 rounded-full bg-surface-container-high transition-transform group-hover:scale-110">
                 {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
           </button>

           {showMore && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 animate-spring-up">
                {secondaryFeatures.map((f, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                     <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center shrink-0 border border-outline-variant group-hover:bg-primary group-hover:text-on-primary transition-all shadow-inner">
                        <f.icon size={20} strokeWidth={2} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-slab font-bold uppercase tracking-tight text-on-surface">{f.title}</h4>
                        <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed">{f.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
      
      <div className="absolute inset-0 ledger-grid pointer-events-none opacity-20" />
    </section>
  );
};