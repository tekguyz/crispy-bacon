
import React, { useCallback, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { triggerHaptic } from '../../services/hapticService';

const ConfirmationModal: React.FC = () => {
  const { confirmation, closeConfirmation } = useAppStore();
  const [isClosing, setIsClosing] = useState(false);
  
  const handleClose = useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      if (confirmation.onCancel) {
        confirmation.onCancel();
      }
      closeConfirmation();
      setIsClosing(false);
    }, 300);
  }, [closeConfirmation, confirmation]);

  const containerRef = useFocusTrap(confirmation.isOpen, handleClose);

  if (!confirmation.isOpen) return null;

  const handleConfirm = () => {
    // Critical destructive actions get Heavy, regular confirms get Medium
    triggerHaptic(confirmation.variant === 'danger' ? 'heavy' : 'medium');
    confirmation.onConfirm();
    closeConfirmation();
  };

  const displayTitle = confirmation.title;
  const displayConfirmLabel = confirmation.confirmLabel;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[210] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        ref={containerRef}
        className={`bg-background w-[calc(100%-2rem)] max-w-md rounded-[2.5rem] max-h-[90dvh] shadow-2xl overflow-hidden border-t-4 md:border-4 border-outline-variant flex flex-col justify-center focus:outline-none relative mb-4 md:mb-0 ${isClosing ? 'animate-sheet-down' : 'md:animate-scale-in animate-sheet-up'}`}
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="md:hidden flex justify-center pt-3 pb-2 shrink-0">
           <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <div className="p-8 md:p-10 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shrink-0 ${
            confirmation.variant === 'danger' 
              ? 'bg-error/10 text-error shadow-lg shadow-error/10' 
              : 'bg-primary/10 text-primary shadow-lg shadow-primary/10'
          }`}>
            {confirmation.variant === 'danger' ? (
              <AlertTriangle size={24} aria-hidden="true" />
            ) : (
              <Info size={24} aria-hidden="true" />
            )}
          </div>

          <h2 id="confirm-title" className="text-xl font-black text-on-surface mb-3 tracking-tighter uppercase leading-tight">
            {displayTitle}
          </h2>
          
          <p id="confirm-desc" className="text-xs md:text-sm font-bold text-on-surface-variant leading-relaxed mb-8 opacity-60 max-w-[260px]">
            {confirmation.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full shrink-0 mt-auto">
            <button
              onClick={handleClose}
              className="order-2 sm:order-1 flex-1 h-14 md:h-12 px-5 rounded-2xl md:rounded-xl font-black text-[11px] md:text-[10px] uppercase tracking-widest text-on-surface bg-transparent border border-outline-variant hover:bg-surface-container-high transition-all focus:outline-none interactive"
            >
              {confirmation.cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={`order-1 sm:order-2 flex-1 h-14 md:h-12 px-5 rounded-2xl md:rounded-xl font-black text-[11px] md:text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 focus:outline-none interactive ${
                confirmation.variant === 'danger'
                  ? 'bg-error text-on-error hover:opacity-90 shadow-error/30'
                  : 'bg-primary text-on-primary hover:brightness-110 shadow-primary/30'
              }`}
            >
              {displayConfirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
