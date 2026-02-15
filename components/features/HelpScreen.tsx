
import React from 'react';
import { BookOpen, ShieldCheck, Crown, ArrowRight, Zap, Target } from 'lucide-react';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { useAppStore } from '../../store/useAppStore';
import { triggerHaptic } from '../../services/hapticService';

const MANUAL_CONTENT = `
# User Guide
### Research Assistant

Crispy Bacon is designed to be a quiet place to think. It captures audio or text and turns it into clear, useful notes using advanced AI.

---

## 1. Recording Methods
*   **Voice Memos**: Record thoughts directly. Private and secure.
*   **Meetings**: Capture audio from Zoom, Teams, or Meet. No bots required.
*   **Import**: Upload files or paste links for instant summary.

## 2. Summary Types
We separate facts from fluff.
*   **Executive Brief**: The bottom line. Focuses on decisions.
*   **Technical Review**: Engineering details and blockers.
*   **Product Discovery**: User feedback and friction points.

## 3. Ask Your Notes
Don't just read. Ask.
*   **Chat**: Find specific details in the text.
*   **Voice Mode**: Talk to your notes while walking.
`;

const HelpScreen: React.FC = () => {
  const { setShowUpgradeModal, userProfile } = useAppStore();
  const isPro = !!userProfile?.is_pro;

  const handleUpgrade = () => {
    triggerHaptic('medium');
    setShowUpgradeModal(true);
  };

  return (
    <div className="container-fluid max-w-3xl mx-auto pt-8 pb-40 animate-fade-in space-y-12">
      {/* Header */}
      <header className="flex items-center gap-5 border-b border-outline-variant/10 pb-8">
        <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary shadow-inner border border-outline-variant/10">
           <BookOpen size={28} strokeWidth={2} />
        </div>
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tight text-on-surface">User Guide</h1>
           <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">Documentation v2.5</p>
        </div>
      </header>

      {/* Manual Content */}
      <div className="prose-manual">
         <MarkdownRenderer content={MANUAL_CONTENT} />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-outline-variant/10">
         <div className="p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-success/10 text-success rounded-lg">
                 <ShieldCheck size={18} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest">Privacy Core</h3>
            </div>
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-80">
               Your data is isolated. We never use your notes to train general AI models. When you delete a note, it is wiped from our servers instantly.
            </p>
         </div>

         <div className="p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
               <Crown size={80} />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
               <div className="p-2 bg-primary/10 text-primary rounded-lg">
                 <Crown size={18} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest">Pro Plan</h3>
            </div>
            
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-80 relative z-10">
               Unlock unlimited history, 60-minute recordings, and the Deep Strategist model.
            </p>
            
            {!isPro && (
                <button 
                   onClick={handleUpgrade}
                   className="mt-auto pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-on-surface transition-colors relative z-10"
                >
                   Activate Membership <ArrowRight size={12} strokeWidth={3} />
                </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/10 flex items-center gap-3">
             <Zap size={16} className="text-primary opacity-60" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest">Gemini 3 Flash</span>
                <span className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Standard Model</span>
             </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/10 flex items-center gap-3">
             <Target size={16} className="text-primary opacity-60" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest">Gemini 3 Pro</span>
                <span className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Reasoning Model</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default HelpScreen;
