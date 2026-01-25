import React from 'react';
import { ShieldCheck, Radio, Globe, Database, Zap, BookOpen } from 'lucide-react';

const MANUAL_DATA = [
  { q: "Audio Capture", a: "Bacon records audio from your computer's system output. No bots, no avatars.", icon: Radio },
  { q: "Fact-Based", a: "The assistant is instructed not to guess. If a decision wasn't made, it won't invent one.", icon: ShieldCheck },
  { q: "Secure Vault", a: "Notes are isolated and encrypted. We never train general AI models on your private data.", icon: Database },
  { q: "Link Analysis", a: "Paste any link to extract core research points and organized takeaways instantly.", icon: Globe }
];

export const FAQSection: React.FC = () => {
  return (
    <div id="faq" className="mt-20 pt-20 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4">
           <div className="flex items-center gap-2 opacity-40">
              <BookOpen size={12} strokeWidth={3} />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Briefing</span>
           </div>
           <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface italic">Tech <br/>Specs.</h3>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
          {MANUAL_DATA.map((item, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 border border-outline-variant/10 group-hover:scale-110 transition-transform shadow-inner">
                <item.icon size={16} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[12px] font-black uppercase tracking-widest text-on-surface">{item.q}</h4>
                 <p className="text-[11px] font-medium text-on-surface-variant opacity-60 leading-tight">
                    {item.a}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};