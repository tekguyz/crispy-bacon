
import React from 'react';
import { Sun, Moon, Monitor, Smartphone, Palette } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { ThemeOption } from '../../../types';

export const InterfaceSection: React.FC = () => {
  const { theme, setTheme, hapticIntensity, setHapticIntensity } = useAppStore();

  const themes: { id: ThemeOption; icon: React.ElementType; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'Auto' },
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Appearance */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 px-1">
              <Palette size={12} className="text-primary opacity-60" />
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Appearance</label>
           </div>
           <div className="flex bg-surface-container-high border border-outline-variant/10 rounded-xl p-1 shadow-inner">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${theme === t.id ? 'bg-background text-on-surface shadow-sm text-primary' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                >
                   <t.icon size={12} strokeWidth={3} /> {t.label}
                </button>
              ))}
           </div>
        </div>

        {/* Haptics */}
        <div className="space-y-3">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <Smartphone size={12} className="text-primary opacity-60" />
                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Vibration</label>
              </div>
              <span className="text-[9px] font-mono font-bold text-primary">{Math.round(hapticIntensity * 100)}%</span>
           </div>
           <div className="h-10 flex items-center px-2">
             <input 
                type="range" 
                min="0" 
                max="1.5" 
                step="0.1" 
                value={hapticIntensity} 
                onChange={(e) => setHapticIntensity(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer"
             />
           </div>
        </div>

      </div>
    </div>
  );
};
