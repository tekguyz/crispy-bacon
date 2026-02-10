
import React, { useState } from 'react';
import { Plus, X, Mic, FileText, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { triggerHaptic } from '../../services/hapticService';

interface FloatingCommandCenterProps {
  isSidebarOpen: boolean;
}

export const FloatingCommandCenter: React.FC<FloatingCommandCenterProps> = ({ isSidebarOpen }) => {
  const store = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const isDetailView = store.view === AppView.INSIGHT;
  const isStaticDocView = [AppView.HELP, AppView.SETTINGS, AppView.TERMS, AppView.PRIVACY, AppView.AI_ETHICS].includes(store.view);

  if (isDetailView || isStaticDocView) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setIsOpen(!isOpen);
  };

  const handleAskLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    store.setShowGlobalChat(true);
  };

  const handleAction = (type: 'record' | 'import') => {
    triggerHaptic('medium');
    if (type === 'record') {
      store.setShowCaptureLab(true);
    } else {
      store.setShowInputModal(true);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[130]">
      {/* Backdrop: Only captures clicks when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[140] pointer-events-auto animate-fade-in" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      {/* Command Hub Container */}
      <div className={`fixed bottom-8 right-8 flex flex-col items-center gap-3 transition-all duration-300 z-[150] ${isSidebarOpen || store.showInputModal || store.showCaptureLab ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}>
          
          {/* ASK LIBRARY (Sparkles) - Hidden when menu is open to focus on actions */}
          {!isOpen && (
            <Tooltip content="Ask Library" side="left">
              <button 
                  onClick={handleAskLibrary}
                  className="w-10 h-10 bg-surface-container-highest border border-outline-variant rounded-full flex items-center justify-center shadow-xl pointer-events-auto hover:border-primary/50 transition-all group active:scale-90"
                  aria-label="Ask library"
              >
                  <Sparkles size={16} className="text-primary group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
              </button>
            </Tooltip>
          )}

          {/* MAIN FAB & MENU GROUP */}
          <div className="relative pointer-events-none">
            {/* Side Menu */}
            <div 
                className={`absolute right-full mr-4 bottom-0 flex items-center gap-2 transition-all duration-400 ease-spring ${isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                role="menu"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('record'); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-primary text-on-primary rounded-xl h-11 px-5 shadow-2xl border border-white/10 hover:brightness-110 transition-all active:scale-95 whitespace-nowrap pointer-events-auto"
                >
                    <Mic size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Record</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('import'); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-on-surface text-surface rounded-xl h-11 px-5 shadow-2xl border border-outline-variant/10 hover:bg-primary hover:text-on-primary transition-all active:scale-95 whitespace-nowrap pointer-events-auto"
                >
                    <FileText size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Import</span>
                </button>
            </div>

            {/* Toggle Button */}
            <Tooltip content={isOpen ? "Close" : "New Recap"} side="left">
                <button 
                    onClick={handleToggle} 
                    className={`
                    rounded-2xl shadow-2xl flex items-center justify-center pointer-events-auto border-2 transition-all active:scale-90
                    w-12 h-12
                    ${isOpen ? 'bg-background text-primary border-primary' : 'bg-primary text-primary-foreground border-background'}
                    `}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label="Main Menu"
                >
                    {isOpen ? <X size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                </button>
            </Tooltip>
          </div>
      </div>
    </div>
  );
};
