
import React, { useState } from 'react';
import { Plus, X, Mic, FileText, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { triggerHaptic } from '../../services/hapticService';
import { GlobalChatSheet } from './dashboard/GlobalChatSheet';

interface FloatingCommandCenterProps {
  isSidebarOpen: boolean;
}

export const FloatingCommandCenter: React.FC<FloatingCommandCenterProps> = ({ isSidebarOpen }) => {
  const store = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);

  const isDetailView = store.view === AppView.INSIGHT;
  const isStaticDocView = [AppView.HELP, AppView.SETTINGS, AppView.TERMS, AppView.PRIVACY, AppView.AI_ETHICS].includes(store.view);

  if (isDetailView || isStaticDocView) return null;

  const handleToggle = () => {
    triggerHaptic('light');
    setIsOpen(!isOpen);
  };

  const handleAskLibrary = () => {
    triggerHaptic('medium');
    setIsGlobalChatOpen(true);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[130]">
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 pointer-events-auto animate-fade-in" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      {/* v2.5.3: Unified Pillar Positioning. 
          Container is pointer-events-none, buttons are auto. 
          This ensures you only block scrolls if you touch EXACTLY on the icons.
      */}
      <div className={`fixed bottom-8 right-8 flex flex-col items-center gap-3 transition-all duration-300 ${isSidebarOpen || store.showInputModal || store.showCaptureLab ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}>
          
          {/* Secondary Action: Ask Library (Sparkles) */}
          {!isOpen && (
            <Tooltip content="Ask Library" side="left">
              <button 
                  onClick={handleAskLibrary}
                  className="w-11 h-11 bg-surface-container-highest border border-outline-variant rounded-full flex items-center justify-center shadow-xl pointer-events-auto hover:border-primary/50 transition-all group active:scale-90"
                  aria-label="Ask library"
              >
                  <Sparkles size={18} className="text-primary group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
              </button>
            </Tooltip>
          )}

          {/* Primary Action: Add Signal (Plus) */}
          <div className="relative">
            {/* Pop-out Menu: Slides to the LEFT of the column */}
            <div 
                className={`absolute right-full mr-4 bottom-0 flex items-center gap-2 transition-all duration-400 ease-spring ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                role="menu"
            >
                <button 
                    onClick={() => { store.setShowCaptureLab(true); setIsOpen(false); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-primary text-on-primary rounded-xl h-12 px-5 shadow-2xl border border-white/10 pointer-events-auto hover:brightness-110 transition-all active:scale-95 whitespace-nowrap"
                >
                    <Mic size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Record</span>
                </button>
                <button 
                    onClick={() => { store.setShowInputModal(true); setIsOpen(false); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-on-surface text-surface rounded-xl h-12 px-5 shadow-2xl border border-outline-variant/10 pointer-events-auto hover:bg-primary hover:text-on-primary transition-all active:scale-95 whitespace-nowrap"
                >
                    <FileText size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Import</span>
                </button>
            </div>

            <Tooltip content={isOpen ? "Close" : "New Recap"} side="left">
                <button 
                    onClick={handleToggle} 
                    className={`
                    rounded-2xl shadow-2xl flex items-center justify-center pointer-events-auto border-2 transition-all active:scale-90 z-50
                    w-14 h-14
                    ${isOpen ? 'bg-background text-primary border-primary' : 'bg-primary text-primary-foreground border-background'}
                    `}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label="Main Menu"
                >
                    {isOpen ? <X size={22} strokeWidth={3} /> : <Plus size={22} strokeWidth={3} />}
                </button>
            </Tooltip>
          </div>
      </div>

      <GlobalChatSheet isOpen={isGlobalChatOpen} onClose={() => setIsGlobalChatOpen(false)} />
    </div>
  );
};
