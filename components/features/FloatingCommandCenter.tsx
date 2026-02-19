
import React, { useState } from 'react';
import { Plus, X, Mic, FileText } from 'lucide-react';
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
      <div className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-center gap-3 transition-all duration-300 z-[150] ${isSidebarOpen || store.showInputModal || store.showCaptureLab ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}>
          
          {/* MAIN FAB & MENU GROUP */}
          <div className="relative pointer-events-none flex flex-col items-center">
            {/* Side Menu (Mobile: Vertical, Desktop: Horizontal) */}
            <div 
                className={`absolute bottom-full mb-4 md:bottom-0 md:right-full md:mr-4 flex flex-col md:flex-row items-center gap-3 transition-all duration-400 ease-spring ${isOpen ? 'opacity-100 translate-y-0 md:translate-x-0 pointer-events-auto' : 'opacity-0 translate-y-8 md:translate-x-8 pointer-events-none'}`}
                role="menu"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('record'); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-primary text-on-primary rounded-xl h-12 md:h-11 px-6 md:px-5 shadow-2xl border border-white/10 hover:brightness-110 transition-all active:scale-95 whitespace-nowrap pointer-events-auto"
                >
                    <Mic className="w-4 h-4 md:w-3.5 md:h-3.5" strokeWidth={3} />
                    <span className="text-[11px] md:text-[10px] font-black uppercase tracking-widest">Record</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('import'); }} 
                    role="menuitem"
                    className="flex items-center gap-3 bg-on-surface text-surface rounded-xl h-12 md:h-11 px-6 md:px-5 shadow-2xl border border-outline-variant/10 hover:bg-primary hover:text-on-primary transition-all active:scale-95 whitespace-nowrap pointer-events-auto"
                >
                    <FileText className="w-4 h-4 md:w-3.5 md:h-3.5" strokeWidth={3} />
                    <span className="text-[11px] md:text-[10px] font-black uppercase tracking-widest">Import</span>
                </button>
            </div>

            {/* Toggle Button */}
            <Tooltip content={isOpen ? "Close" : "New Recap"} side="left">
                <button 
                    onClick={handleToggle} 
                    className={`
                    rounded-2xl shadow-2xl flex items-center justify-center pointer-events-auto border-2 transition-all active:scale-90
                    w-14 h-14 md:w-12 md:h-12
                    ${isOpen ? 'bg-background text-primary border-primary' : 'bg-primary text-on-primary border-background'}
                    `}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label="Main Menu"
                >
                    {isOpen ? <X className="w-6 h-6 md:w-5 md:h-5" strokeWidth={3} /> : <Plus className="w-6 h-6 md:w-5 md:h-5" strokeWidth={3} />}
                </button>
            </Tooltip>
          </div>
      </div>
    </div>
  );
};
