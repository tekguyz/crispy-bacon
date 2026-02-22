import React from 'react';
import { Copy, Check, FileText, Hash } from 'lucide-react';
import { InsightContent } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';

interface ExportActionsProps {
  insight: InsightContent;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ insight }) => {
  const [copyState, setCopyState] = React.useState<'notion' | 'obsidian' | null>(null);
  const addToast = useAppStore(state => state.addToast);

  const copyToClipboard = async (type: 'notion' | 'obsidian') => {
    triggerHaptic('light');
    const { generateInsightMarkdownReport } = await import('../../../services/dataTransformers');
    const text = generateInsightMarkdownReport(insight, type);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(type);
      addToast(`${type === 'notion' ? 'Notion' : 'Obsidian'} note copied.`, 'success');
      setTimeout(() => setCopyState(null), 2000);
    } catch (err) {
      addToast('Export failed.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={() => copyToClipboard('notion')}
        className={`
          flex items-center justify-between w-full h-11 px-4 rounded-xl border transition-all active:scale-[0.98] group
          ${copyState === 'notion' 
            ? 'bg-success/5 border-success/40 text-success' 
            : 'bg-surface-container-high border-outline-variant/5 hover:border-primary/20 text-on-surface'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${copyState === 'notion' ? 'bg-success/10' : 'bg-background shadow-inner'}`}>
            <FileText size={14} className={copyState === 'notion' ? 'text-success' : 'text-on-surface-variant group-hover:text-primary'} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">To Notion</span>
        </div>
        {copyState === 'notion' ? <Check size={14} strokeWidth={4} /> : <Copy size={12} className="opacity-10 group-hover:opacity-100" />}
      </button>

      <button 
        onClick={() => copyToClipboard('obsidian')}
        className={`
          flex items-center justify-between w-full h-11 px-4 rounded-xl border transition-all active:scale-[0.98] group
          ${copyState === 'obsidian' 
            ? 'bg-success/5 border-success/40 text-success' 
            : 'bg-surface-container-high border-outline-variant/5 hover:border-primary/20 text-on-surface'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${copyState === 'obsidian' ? 'bg-success/10' : 'bg-background shadow-inner'}`}>
            <Hash size={14} className={copyState === 'obsidian' ? 'text-success' : 'text-on-surface-variant group-hover:text-primary'} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">To Obsidian</span>
        </div>
        {copyState === 'obsidian' ? <Check size={14} strokeWidth={4} /> : <Copy size={12} className="opacity-10 group-hover:opacity-100" />}
      </button>
      
      <div className="flex items-center gap-2 px-1 opacity-30 mt-1">
         <div className="w-1 h-1 rounded-full bg-primary" />
         <span className="text-[7px] font-mono font-bold uppercase tracking-widest">Obsidian export includes YAML properties.</span>
      </div>
    </div>
  );
};