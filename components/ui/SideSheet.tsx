
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { triggerHaptic } from '../../services/hapticService';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SideSheet: React.FC<SideSheetProps> = ({ isOpen, onClose, title, children }) => {
  const sheetRef = useFocusTrap(isOpen, onClose);

  useEffect(() => {
    // Esc is handled by useFocusTrap usually, but we keep this as explicit backup for sheet
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {/* solid contrast backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[140] animate-fade-in" 
          onClick={onClose} 
        />
      )}
      
      <aside
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          fixed z-[150] bg-background shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
          transition-all duration-500 ease-spring transform
          /* Desktop: Right Side Sheet */
          md:top-0 md:right-0 md:h-full md:w-[480px] md:border-l md:border-outline-variant md:rounded-l-[2.5rem]
          ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
          /* Mobile: Bottom Sheet */
          bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] h-[85dvh] rounded-t-[2.5rem] border-t border-outline-variant
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          md:left-auto md:translate-x-full
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
             <div className="w-12 h-1 bg-on-surface/10 rounded-full" />
          </div>

          <header className="h-16 flex items-center justify-between px-8 border-b border-outline-variant bg-surface-container shrink-0">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface truncate pr-4">
              {title}
            </h2>
            <button 
              onClick={() => { triggerHaptic('light'); onClose(); }}
              className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-all text-on-surface-variant hover:text-on-surface active:scale-90 border border-outline-variant"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
};
