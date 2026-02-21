
import React from 'react';
import { X, Globe } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface ImportHeaderProps {
  onClose: () => void;
}

export const ImportHeader: React.FC<ImportHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Globe size={16} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-on-surface">Import Content</h2>
          <p className="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-wider">Add to your library</p>
        </div>
      </div>
      
      <button 
        onClick={() => { triggerHaptic('light'); onClose(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
