
import React from 'react';
import { Sun, Moon, Monitor, Palette, Smartphone } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { ThemeOption } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';

export const AppearanceSection: React.FC = () => {
  const { theme, setTheme, hapticIntensity, setHapticIntensity } = useAppStore();

  const options: { id: ThemeOption; icon: React.ElementType; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-8 h-full shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
           <Palette size={14} className="text-primary" strokeWidth={3} />
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Visual Mode</label>
        </div>
        <div className="bg-surface-container-high border border-outline-variant/10 rounded-2xl p-1.5 flex items-stretch shadow-inner gap-1.5 w-full overflow-x-auto">
          {options.map((opt) => (
            <Tooltip key={opt.id} content={`${opt.label} Mode`} className="flex-1 min-w-[70px]">
                <button 
                    onClick={() => setTheme(opt.id)}
                    className={`w-full flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all h-14 ${theme === opt.id ? 'bg-primary text-on-primary shadow-lg scale-[1.02]' : 'text-on-surface-variant/40 hover:bg-surface-container-highest hover:text-on-surface'}`}
                >
                    <opt.icon size={16} strokeWidth={theme === opt.id ? 3 : 2} />
                    <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">{opt.label}</span>
                </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-outline-variant/5">
         <div className="flex items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-2">
               <Smartphone size={12} className="text-primary opacity-60" />
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Tactile Feedback</label>
            </div>
            <span className="text-[8px] font-mono font-bold text-primary">{Math.round(hapticIntensity * 100)}%</span>
         </div>
         <input 
            type="range" 
            min="0" 
            max="1.5" 
            step="0.1" 
            value={hapticIntensity} 
            onChange={(e) => setHapticIntensity(parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer"
         />
         <div className="flex justify-between px-1 text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">
            <span>Off</span>
            <span>Standard</span>
            <span>Heavy</span>
         </div>
      </div>
    </div>
  );
};
