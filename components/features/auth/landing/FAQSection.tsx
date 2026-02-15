
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    <section id="faq" className="py-24 bg-background border-t border-outline-variant/10">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-4 space-y-6">
             <div className="flex items-center gap-2 opacity-40">
                <HelpCircle size={12} strokeWidth={3} />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Support</span>
             </div>
             <h3 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface italic leading-none">
               Common <br/>Questions.
             </h3>
             <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed max-w-xs">
                Everything you need to know about privacy, recording, and how we handle your research.
             </p>
          </div>

          <div className="md:col-span-8">
             <div className="divide-y divide-outline-variant/10 border-t border-b border-outline-variant/10">
                {FAQS.map((item, i) => {
                   const isOpen = openIndex === i;
                   return (
                     <div key={i} className="group">
                        <button 
                          onClick={() => toggle(i)}
                          className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
                        >
                           <span className={`text-sm md:text-base font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                             {item.q}
                           </span>
                           <div className={`p-1 rounded-full border transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-on-primary rotate-180' : 'bg-transparent border-outline-variant/20 text-on-surface-variant'}`}>
                              <ChevronDown size={16} strokeWidth={3} />
                           </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-spring ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                           <p className="text-sm font-medium text-on-surface-variant leading-relaxed max-w-2xl">
                             {item.a}
                           </p>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
