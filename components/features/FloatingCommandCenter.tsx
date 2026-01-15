import React, { useState } from 'react';
import { Plus, X, Mic, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { Tooltip } from '../ui/Tooltip';

interface FloatingCommandCenterProps {
  isSidebarOpen: boolean;
}

export const FloatingCommandCenter: React.FC<FloatingCommandCenterProps> = ({ isSidebarOpen }) => {
  const store = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const isDetailView = store.view === AppView.INSIGHT;
  const isStaticDocView = [AppView.HELP, AppView.SETTINGS, AppView.TERMS, AppView.PRIVACY, AppView.AI_ETHICS].includes(store.view);

  if (isDetailView || isStaticDocView) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 pointer-events-auto animate-fade-in" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      <div className={`fixed bottom-10 right-6 md:bottom-8 md:right-10 flex flex-col-reverse items-end gap-4 z-50 transition-all duration-300 ${isSidebarOpen || store.showInputModal || store.showCaptureLab ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}>
          <Tooltip content={isOpen ? "Close Actions" : "Create New Recap"} side="left">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`
                  rounded-3xl shadow-2xl flex items-center justify-center pointer-events-auto border-4 transition-all active:scale-90 z-50
                  w-16 h-16
                  ${isOpen ? 'bg-surface-container-highest text-primary border-primary' : 'bg-primary text-primary-foreground border-background'}
                `}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Workspace Actions Menu"
            >
                {isOpen ? <X size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
            </button>
          </Tooltip>
          
          <div 
            className={`flex flex-col items-end gap-3 transition-all duration-400 ease-spring ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-75 pointer-events-none'}`}
            role="menu"
          >
              <button 
                  onClick={() => { store.setShowCaptureLab(true); setIsOpen(false); }} 
                  role="menuitem"
                  className="group flex items-center gap-4 bg-primary text-on-primary rounded-2xl px-6 py-5 md:px-10 md:py-6 shadow-2xl border-2 border-white/10 pointer-events-auto hover:brightness-110 transition-all active:scale-95"
              >
                  <Mic size={18} strokeWidth={3} className="shrink-0" aria-hidden="true" />
                  <span className="text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap">Record Session</span>
              </button>
              <button 
                  onClick={() => { store.setShowInputModal(true); setIsOpen(false); }} 
                  role="menuitem"
                  className="group flex items-center gap-4 bg-on-surface text-surface rounded-2xl px-6 py-5 md:px-10 md:py-6 shadow-2xl border-2 border-outline-variant/10 pointer-events-auto hover:bg-primary hover:text-on-primary transition-all active:scale-95"
              >
                  <FileText size={18} strokeWidth={3} className="shrink-0" aria-hidden="true" />
                  <span className="text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap">Import Research</span>
              </button>
          </div>
      </div>
    </div>
  );
};