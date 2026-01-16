import React from 'react';
import { Play, Pause } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface ActionFooterProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isGuest: boolean;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ 
  isPaused, onPause, onResume, onStop, isGuest 
}) => (
  <footer className="p-3 border-t border-outline-variant/10 bg-surface-container-low shrink-0 z-10 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
    <div className="flex gap-2.5 max-w-4xl mx-auto h-14 md:h-12">
      <button 
        onClick={() => { triggerHaptic('light'); isPaused ? onResume() : onPause(); }} 
        className="h-full md:px-6 bg-surface-container-highest border border-outline-variant/10 rounded-xl flex items-center justify-center text-on-surface hover:bg-background transition-all shrink-0 active:scale-95 shadow-sm"
      >
        {isPaused ? <Play size={16} fill="currentColor" className="shrink-0" /> : <Pause size={16} fill="currentColor" className="shrink-0" />}
        <span className="hidden md:inline ml-2 text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest">{isPaused ? 'Resume' : 'Pause'}</span>
      </button>
      <button 
        onClick={() => { triggerHaptic('heavy'); onStop(); }} 
        className="flex-1 h-full bg-primary text-on-primary rounded-xl font-extrabold uppercase text-[11px] md:text-xs tracking-[0.25em] transition-all shadow-m3-2 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2.5"
      >
        {isGuest ? 'SAVE DRAFT' : 'FINISH'}
      </button>
    </div>
  </footer>
);