
import React from 'react';
import { Zap, Brain, Lock, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { PersonaStyle } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

interface DepthToggleProps {
  isPro: boolean;
}

export const DepthToggle: React.FC<DepthToggleProps> = ({ isPro }) => {
  const { personaStyle, setPersonaStyle, setShowUpgradeModal } = useAppStore();

  const handleToggle = (style: PersonaStyle) => {
    if (!isPro && style === PersonaStyle.DEEP_RESEARCH) {
      triggerHaptic('medium');
      setShowUpgradeModal(true);
      return;
    }
    triggerHaptic('light');
    setPersonaStyle(style);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Brain size={12} className="text-primary opacity-40" />
        <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">Detail Level</h3>
      </div>

      <div className="p-1 bg-surface-container-high border border-outline-variant/10 rounded-xl flex gap-1 shadow-inner">
        <button
          onClick={() => handleToggle(PersonaStyle.CONCISE)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all active:scale-95 ${
            personaStyle === PersonaStyle.CONCISE 
              ? 'bg-background text-on-surface shadow-sm border border-outline-variant/10' 
              : 'text-on-surface-variant/40 hover:text-on-surface'
          }`}
        >
          <Zap size={11} fill={personaStyle === PersonaStyle.CONCISE ? "currentColor" : "none"} />
          <span className="text-[9px] font-black uppercase tracking-tight">Recap</span>
        </button>

        <button
          onClick={() => handleToggle(PersonaStyle.DEEP_RESEARCH)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all active:scale-95 relative overflow-hidden ${
            personaStyle === PersonaStyle.DEEP_RESEARCH 
              ? 'bg-primary text-on-primary shadow-lg' 
              : 'text-on-surface-variant/40 hover:text-on-surface'
          }`}
        >
          {!isPro && <Lock size={9} className="opacity-40 shrink-0" />}
          <Brain size={11} fill={personaStyle === PersonaStyle.DEEP_RESEARCH ? "currentColor" : "none"} />
          <span className="text-[9px] font-black uppercase tracking-tight">Deep Research</span>
        </button>
      </div>
    </div>
  );
};
