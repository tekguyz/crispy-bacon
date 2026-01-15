import React from 'react';
import { X, Layers } from 'lucide-react';

export const ImportHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between px-6 py-3.5 border-b border-outline-variant/5 bg-surface-container-low shrink-0 pt-[calc(env(safe-area-inset-top)+0.5rem)] md:pt-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <Layers size={14} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-black font-display uppercase italic tracking-tighter text-on-surface leading-none">Add Note</h2>
          <span className="text-[7px] font-mono font-black uppercase tracking-widest text-on-surface-variant opacity-30">Add content to summarize</span>
        </div>
      </div>
      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-xl transition-colors text-on-surface-variant hover:text-on-surface shrink-0 border border-outline-variant/10">
        <X size={16} />
      </button>
  </div>
);