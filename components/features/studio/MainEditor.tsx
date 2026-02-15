
import React from 'react';
import { FileText, AlignLeft } from 'lucide-react';

interface MainEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({ value, onChange }) => (
  <div className="flex-1 flex flex-col min-h-[40vh] md:min-h-0 bg-background relative overflow-hidden">
      {/* Structural Margin Line */}
      <div className="absolute left-[3.5rem] md:left-[5rem] top-0 bottom-0 w-px bg-outline-variant/10 pointer-events-none hidden md:block" />

      <div className="flex items-center justify-between py-3 px-6 md:px-10 border-b border-outline-variant/5 bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-3">
            <AlignLeft size={14} className="text-primary/40" />
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40 leading-none">Notes</label>
          </div>
          <div className="flex items-center gap-4 text-[8px] font-mono font-black text-on-surface-variant opacity-20 uppercase tracking-widest">
             <span>{value.split(/\s+/).filter(Boolean).length} words</span>
             <div className="w-1 h-1 rounded-full bg-current" />
             <span>Saved</span>
          </div>
      </div>

      <div className="flex-1 relative">
        <textarea 
          className="w-full h-full text-on-surface p-8 md:pl-[6.5rem] md:pr-12 md:py-12 resize-none focus:outline-none text-base md:text-xl font-medium leading-[1.6] placeholder:text-on-surface/10 transition-all custom-scrollbar bg-transparent selection:bg-primary/20 selection:text-primary"
          placeholder="Capture your thoughts as they arrive..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoFocus={typeof window !== 'undefined' && window.innerWidth >= 768}
        />
      </div>
  </div>
);
