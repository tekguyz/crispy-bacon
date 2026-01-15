import React from 'react';
import { FileText, Download, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const WorkflowSection: React.FC = () => {
  const { defaultExportFormat, setDefaultExportFormat } = useAppStore();

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-4 h-full">
      <div className="flex items-center gap-3 mb-2">
        <Download size={14} className="text-primary" strokeWidth={3} />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Export Signal</h2>
      </div>

      <div className="space-y-4">
         <div className="relative">
            <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            <select 
              value={defaultExportFormat}
              onChange={(e) => setDefaultExportFormat(e.target.value as any)}
              className="w-full h-14 bg-surface-container border border-outline-variant/10 rounded-2xl pl-10 pr-10 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-background transition-colors shadow-inner"
            >
              <option value="markdown">Markdown (.md)</option>
              <option value="text">Plain Text (.txt)</option>
              <option value="json">JSON Data (.json)</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 pointer-events-none" />
         </div>
         <p className="text-[9px] font-bold text-on-surface-variant/40 px-1 leading-relaxed">
            Markdown is optimized for Notion and Obsidian integration.
         </p>
      </div>
    </div>
  );
};