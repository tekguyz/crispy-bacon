import React from 'react';
import { X } from 'lucide-react';

interface RemovableFilterChipProps {
  label: string;
  onRemove: () => void;
}

const RemovableFilterChip: React.FC<RemovableFilterChipProps> = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-expressive text-xs font-black uppercase tracking-widest shadow-sm border border-outline-variant/30 animate-scale-in group">
      <span className="max-w-[180px] truncate leading-none">{label}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 hover:bg-on-secondary-container/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary active:scale-75"
        aria-label={`Remove filter: ${label}`}
      >
        <X size={14} strokeWidth={4} />
      </button>
    </div>
  );
};

export default RemovableFilterChip;