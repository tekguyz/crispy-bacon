
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
          className="fixed inset-0 bg-black/60 z-[140] animate-fade-in backdrop-blur-sm" 
          onClick={onClose} 
        />
      )}
      
      <aside
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          fixed z-[150] bg-background shadow-2xl
          transition-transform duration-500 ease-[cubic-bezier(0.2,0.0,0,1.0)]
          
          /* Mobile: Bottom Sheet */
          bottom-0 left-0 right-0 w-full h-[90dvh] rounded-t-[2rem] border-t border-outline-variant
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}

          /* Desktop: Right Flush Drawer */
          md:top-0 md:right-0 md:bottom-auto md:left-auto
          md:h-full md:w-[500px] 
          md:rounded-none md:border-l md:border-t-0 md:border-outline-variant
          md:translate-y-0
          ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
             <div className="w-12 h-1 bg-on-surface/10 rounded-full" />
          </div>

          <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-outline-variant/10 bg-surface-container-low shrink-0">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface truncate pr-4">
              {title}
            </h2>
            <button 
              onClick={() => { triggerHaptic('light'); onClose(); }}
              className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-all text-on-surface-variant hover:text-on-surface active:scale-90 border border-outline-variant/10"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-background relative">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
};
