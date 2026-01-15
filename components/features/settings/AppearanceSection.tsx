
import React from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { ThemeOption } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';

export const AppearanceSection: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  const options: { id: ThemeOption; icon: React.ElementType; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-4 h-full shadow-sm">
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
  );
};
