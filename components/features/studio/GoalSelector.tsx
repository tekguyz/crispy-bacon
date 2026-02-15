
import React from 'react';
import { Target, Sparkles, Briefcase, Box, Cpu, Users } from 'lucide-react';
import { InsightTemplate } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';

interface GoalSelectorProps {
  selectedTemplate: InsightTemplate;
  onSetTemplate: (t: InsightTemplate) => void;
  disabled: boolean;
  isPro: boolean;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  selectedTemplate, onSetTemplate, disabled, isPro
}) => {
  const { currentIntent, setCurrentIntent } = useAppStore();

  const templateConfig = [
    { id: InsightTemplate.EXECUTIVE, label: 'Exec', icon: Briefcase },
    { id: InsightTemplate.PRODUCT, label: 'Prod', icon: Box },
    { id: InsightTemplate.ENGINEERING, label: 'Tech', icon: Cpu },
    { id: InsightTemplate.STAKEHOLDER, label: 'Stake', icon: Users },
  ];

  const handleSelect = (t: InsightTemplate) => {
    triggerHaptic('light');
    onSetTemplate(t);
  };

  return (
    <div className={`space-y-5 transition-all ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
           <Target size={10} className="text-primary opacity-40" />
           <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60">Analysis Focus</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
           {templateConfig.map((t) => {
             const isSelected = selectedTemplate === t.id;
             return (
                <button 
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`
                    flex items-center gap-2.5 p-2.5 rounded-xl border transition-all active:scale-[0.97] group
                    ${isSelected 
                      ? 'bg-primary border-primary text-on-primary shadow-lg' 
                      : 'bg-surface-container-high border-outline-variant/10 text-on-surface-variant hover:border-primary/30'}
                  `}
                >
                  <t.icon size={11} className={isSelected ? 'text-on-primary' : 'opacity-40 group-hover:opacity-100'} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                </button>
             );
           })}
        </div>
      </div>

      <div className="space-y-2.5">
         <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
               <Sparkles size={10} className="text-primary opacity-40" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60">Custom Goal</h3>
            </div>
            {!isPro && <span className="text-[7px] font-mono font-black text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase">PRO</span>}
         </div>
         
         <div className="relative group">
            <textarea 
              value={currentIntent}
              onChange={(e) => setCurrentIntent(e.target.value)}
              disabled={!isPro}
              placeholder={isPro ? "What should I focus on?" : "Identity required."}
              className={`
                w-full min-h-[60px] bg-surface-container-high border rounded-xl p-3 text-[10px] font-bold leading-relaxed resize-none focus:outline-none transition-all placeholder:text-on-surface-variant/20 shadow-inner
                ${!isPro ? 'opacity-40 grayscale cursor-not-allowed' : 'border-outline-variant/10 focus:border-primary/40'}
              `}
            />
         </div>
      </div>
    </div>
  );
};
