
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { 
    q: "How does the recording work?", 
    a: "We capture audio directly from your computer's system output. This means we don't need to join your Zoom or Teams call as a 'bot'. It's invisible, private, and works with any meeting software." 
  },
  { 
    q: "Is my data private?", 
    a: "Yes. Your recordings and notes are encrypted. We strictly isolate your data—one user cannot see another's notes. Most importantly, we never use your private data to train our AI models." 
  },
  { 
    q: "Can I upload existing files?", 
    a: "Absolutely. You can import audio files (MP3, WAV, M4A) or documents (PDF, DOCX, TXT) directly into your library. The assistant will summarize them just like a live meeting." 
  },
  { 
    q: "Does it work offline?", 
    a: "Yes. The app saves your recordings to your device immediately. You can record without an internet connection, and the AI will process your notes once you're back online." 
  },
  { 
    q: "Can I export my notes?", 
    a: "Your data is yours. You can copy your summaries to Notion, Obsidian, or plain text Markdown at any time. We don't lock you in." 
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface-container-low border-b border-outline-variant/10">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          
          {/* Header Column */}
          <div className="md:col-span-4 sticky top-32">
             <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">FAQ</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-on-surface leading-[0.9] mb-6">
               Common <br/><span className="text-primary italic">Questions.</span>
             </h2>
             <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed">
                Everything you need to know about privacy, recording, and how we handle your research.
             </p>
          </div>

          {/* Accordion Column */}
          <div className="md:col-span-8 space-y-4">
             {FAQS.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i} className={`group rounded-[2rem] border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-background border-primary/20 shadow-xl' : 'bg-background/50 border-outline-variant/10 hover:border-outline-variant/30'}`}>
                     <button 
                       onClick={() => toggle(i)}
                       className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                     >
                        <span className={`text-lg md:text-xl font-bold font-slab tracking-tight transition-colors pr-8 ${isOpen ? 'text-primary' : 'text-on-surface'}`}>
                          {item.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-on-primary rotate-180' : 'bg-transparent border-outline-variant/20 text-on-surface-variant'}`}>
                           <ChevronDown size={16} strokeWidth={3} />
                        </div>
                     </button>
                     
                     <div className={`transition-all duration-500 ease-spring px-8 ${isOpen ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                        <p className="text-base font-serif font-medium text-on-surface-variant opacity-80 leading-relaxed max-w-3xl">
                          {item.a}
                        </p>
                     </div>
                  </div>
                );
             })}
          </div>

        </div>
      </div>
    </section>
  );
};
