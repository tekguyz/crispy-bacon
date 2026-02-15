
import React from 'react';
import { BookOpen, ShieldCheck, Crown } from 'lucide-react';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { useAppStore } from '../../store/useAppStore';

const MANUAL_CONTENT = `
# User Manual
### Professional Intelligence Engine

Crispy Bacon is designed to be a quiet place to think. It captures audio or text and distills it into high-density intelligence.

---

## 1. Capture
*   **Voice Memos**: Record thoughts directly. Private and secure.
*   **Meetings**: Capture system audio from Zoom/Teams. No bots.
*   **Import**: Upload files or paste links for instant analysis.

## 2. Analysis
We separate facts from fluff.
*   **Executive Brief**: The bottom line.
*   **Technical Review**: Engineering details.
*   **Product Discovery**: User feedback.

## 3. Interrogate
Don't just read. Ask.
*   **Chat**: Find specific details in the text.
*   **Voice Mode**: Talk to your notes while walking.
`;

const HelpScreen: React.FC = () => {
  const { setShowUpgradeModal } = useAppStore();

  return (
    <div className="container-fluid max-w-3xl mx-auto pt-8 pb-40 animate-fade-in space-y-12">
      <header className="flex items-center gap-4 border-b border-outline-variant/10 pb-6">
        <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary shadow-inner">
           <BookOpen size={24} strokeWidth={2} />
        </div>
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tight text-on-surface">The Manual</h1>
           <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">System Documentation</p>
        </div>
      </header>

      <div className="prose-manual">
         <MarkdownRenderer content={MANUAL_CONTENT} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-outline-variant/10">
         <div className="p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-4">
            <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-success" />
               <h3 className="text-xs font-black uppercase tracking-widest">Privacy Core</h3>
            </div>
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-80">
               Your data is isolated. We never use your notes to train general AI models. When you delete a note, it is wiped from our servers instantly.
            </p>
         </div>

         <div className="p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-4 group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
               <Crown size={20} className="text-primary" />
               <h3 className="text-xs font-black uppercase tracking-widest">Executive Tier</h3>
            </div>
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-80 mb-4">
               Unlock unlimited history, longer recordings (60m), and the Deep Strategist reasoning engine.
            </p>
            <button 
               onClick={() => setShowUpgradeModal(true)}
               className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
            >
               View Upgrade Options
            </button>
         </div>
      </div>
    </div>
  );
};

export default HelpScreen;
