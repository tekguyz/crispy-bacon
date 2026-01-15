
import React from 'react';
import { PinOff } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';

export const LockedView: React.FC = () => {
  const { setShowUpgradeModal } = useAppStore();

  const handleUnlock = () => {
    triggerHaptic('medium');
    setShowUpgradeModal(true);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center space-y-6 bg-background animate-fade-in">
      <div className="w-16 h-16 bg-on-surface text-surface rounded-expressive flex items-center justify-center shadow-2xl">
        <PinOff size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black font-display uppercase text-on-surface">Note Locked</h2>
        <p className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest max-w-xs leading-relaxed">
          This older signal is archived. Upgrade to unlock permanent history access.
        </p>
      </div>
      <button 
        onClick={handleUnlock} 
        className="px-10 py-4 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl interactive"
      >
        Unlock History
      </button>
    </div>
  );
};
