
import React, { useState, useCallback } from 'react';
import { 
  Zap, Target, Sparkles, Check, ChevronRight, User, Users, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { BaconLogo, GeminiLiveIcon } from '../ui/Logo';

const OnboardingModal: React.FC = () => {
  const { showOnboarding, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);

  const handleClose = useCallback(() => {
    if (step === steps.length - 1) {
      completeOnboarding();
    }
  }, [step]);

  const containerRef = useFocusTrap(showOnboarding, handleClose);

  const steps = [
    {
      title: "Notes. Simplified.",
      subtitle: "CLEAR THINKING",
      desc: "Crispy Bacon turns long meetings and messy documents into clear notes. We find the essence so you can focus on the work.",
      icon: BaconLogo,
      features: ["INSTANT RECAPS", "CLEAR TAKEAWAYS", "PRIVATE VAULT"]
    },
    {
      title: "Listen and Learn.",
      subtitle: "EASY CAPTURE",
      desc: "Record a thought or a full team session. Bacon transcribes your computer's audio directly—no meeting bots, no extra attendees.",
      icon: Zap,
      customContent: (
        <div className="grid grid-cols-1 gap-3 mt-4 w-full">
           <div className="flex items-center gap-4 p-5 bg-surface-container-high rounded-xl border border-outline-variant/10 shadow-inner">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                 <User size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-0.5">Voice Memos</span>
                 <p className="text-[11px] font-bold text-on-surface-variant opacity-70 leading-tight">Private mic recording. Best for solo thoughts and field notes.</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 p-5 bg-surface-container-high rounded-xl border border-outline-variant/10 shadow-inner">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                 <Users size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-0.5">No-Bot Capture</span>
                 <p className="text-[11px] font-bold text-on-surface-variant opacity-70 leading-tight">Works with Zoom, Teams, and Meet. Just your audio, no bots.</p>
              </div>
           </div>
        </div>
      ),
      features: []
    },
    {
      title: "Reasoning Engine.",
      subtitle: "ACTIONABLE NOTES",
      desc: "Our assistant identifies decisions, follow-ups, and key facts automatically. No more digging through long transcripts.",
      icon: Target,
      features: ["CHECKLISTS", "DECISION LOGS", "QUICK RECALL"]
    },
    {
      title: "Ask your Notes.",
      subtitle: "FOLLOW-UP VOICE",
      desc: "Don't just read—ask. Talk to your notes to find specific details or clarify follow-up steps verbally.",
      icon: GeminiLiveIcon,
      features: ["EASY TO ASK", "NATURAL VOICE", "INSTANT ANSWERS"]
    }
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
      <div 
        ref={containerRef}
        className="bg-surface-container w-full max-w-5xl rounded-expressive shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-outline-variant/20 flex flex-col md:flex-row overflow-hidden animate-spring-scale focus:outline-none my-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:w-72 bg-on-surface text-surface border-b md:border-b-0 md:border-r border-outline-variant/10 p-10 flex flex-row md:flex-col justify-between shrink-0 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none hidden md:block">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--surface) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
           </div>

           <div className="flex flex-col gap-10 relative z-10 w-full">
              <div className="w-16 h-16 bg-surface/10 rounded-xl flex items-center justify-center text-brand-primary shadow-2xl border border-surface/5 mx-auto md:mx-0">
                 <current.icon className="size-8" />
              </div>
              
              <div className="space-y-4 w-full hidden md:block">
                <div className="h-2 w-full bg-surface/10 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-brand-primary transition-all duration-700 ease-emphasized" 
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
                   />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                  STEP {step + 1} OF {steps.length}
                </p>
              </div>
           </div>
           
           <div className="md:hidden absolute bottom-0 left-0 right-0 h-1.5 bg-surface/10">
              <div 
                className="h-full bg-brand-primary transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
              />
           </div>
        </div>

        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col bg-background relative overflow-y-auto custom-scrollbar">
           <div className="flex-1 space-y-8 md:space-y-10 animate-slide-up">
              <div className="space-y-3">
                 <div className="inline-flex items-center gap-2 text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">
                    <Sparkles size={12} className="animate-pulse" fill="currentColor" /> {current.subtitle}
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-on-surface leading-none uppercase">
                   {current.title}
                 </h2>
              </div>

              <p className="text-lg md:text-xl font-medium text-on-surface-variant opacity-80 leading-snug max-w-2xl">
                {current.desc}
              </p>

              {current.customContent}

              {current.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pt-6">
                  {current.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-on-surface group">
                        <div className="flex items-center justify-center text-brand-primary shrink-0 p-2 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                          <Check size={18} strokeWidth={4} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">{f}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="pt-12 flex flex-row items-center justify-between gap-6 border-t border-outline-variant/10 mt-12 md:mt-0">
              <button 
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface bg-surface-container-highest hover:bg-surface-container-low transition-all h-14 md:h-12 px-6 rounded-2xl md:rounded-xl interactive ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ArrowLeft size={14} strokeWidth={3} /> PREVIOUS
              </button>
              
              <button 
                onClick={() => isLast ? completeOnboarding() : setStep(s => s + 1)}
                className="px-14 h-14 md:h-12 bg-on-surface text-surface rounded-2xl md:rounded-xl font-black text-[11px] md:text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 hover:brightness-125 transition-all active:scale-95 group interactive"
              >
                 {isLast ? 'GET STARTED' : 'CONTINUE'}
                 <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;