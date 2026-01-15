import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpansionPanelProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ExpansionPanel: React.FC<ExpansionPanelProps> = ({ 
  title, 
  count, 
  children, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-outline-variant/10 last:border-0 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-2 group transition-all duration-300 rounded-expressive hover:bg-surface-container-high/50"
      >
        <div className="flex items-center gap-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary transition-colors">
            {title}
          </h4>
          {count !== undefined && count > 0 && (
            <span className="text-[9px] font-mono font-black px-2.5 py-1 bg-surface-container-high rounded-lg opacity-40 group-hover:opacity-100 transition-opacity">
              {count}
            </span>
          )}
        </div>
        <div className={`p-1.5 rounded-xl transition-all duration-500 ease-spring ${isExpanded ? 'rotate-180 bg-primary/10 text-primary shadow-inner' : 'bg-surface-container-high text-on-surface-variant opacity-40'}`}>
          <ChevronDown size={16} strokeWidth={3} />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-spring overflow-hidden ${isExpanded ? 'max-h-[3000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};