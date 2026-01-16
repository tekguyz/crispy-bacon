import React from 'react';
import { Copy, Check, FileText, Hash } from 'lucide-react';
import { InsightContent } from '../../../types';
import { generateInsightMarkdownReport } from '../../../services/dataTransformers';
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
    const text = generateInsightMarkdownReport(insight, type);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(type);
      addToast(`${type === 'notion' ? 'Notion Block' : 'Obsidian File'} ready.`, 'success');
      setTimeout(() => setCopyState(null), 2000);
    } catch (err) {
      addToast('Handshake failed.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={() => copyToClipboard('notion')}
        className={`
          flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all active:scale-[0.98] group
          ${copyState === 'notion' 
            ? 'bg-success/10 border-success/40 text-success' 
            : 'bg-surface-container-high border-outline-variant/10 hover:border-primary/30 text-on-surface'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${copyState === 'notion' ? 'bg-success/20' : 'bg-background shadow-inner'}`}>
            <FileText size={14} className={copyState === 'notion' ? 'text-success' : 'text-on-surface-variant group-hover:text-primary'} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Copy for Notion</span>
        </div>
        {copyState === 'notion' ? <Check size={14} strokeWidth={4} /> : <Copy size={12} className="opacity-20 group-hover:opacity-100" />}
      </button>

      <button 
        onClick={() => copyToClipboard('obsidian')}
        className={`
          flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all active:scale-[0.98] group
          ${copyState === 'obsidian' 
            ? 'bg-success/10 border-success/40 text-success' 
            : 'bg-surface-container-high border-outline-variant/10 hover:border-primary/30 text-on-surface'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${copyState === 'obsidian' ? 'bg-success/20' : 'bg-background shadow-inner'}`}>
            <Hash size={14} className={copyState === 'obsidian' ? 'text-success' : 'text-on-surface-variant group-hover:text-primary'} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Copy for Obsidian</span>
        </div>
        {copyState === 'obsidian' ? <Check size={14} strokeWidth={4} /> : <Copy size={12} className="opacity-20 group-hover:opacity-100" />}
      </button>
      
      <p className="text-[8px] font-bold text-on-surface-variant/30 uppercase tracking-widest px-1">
        Obsidian export includes metadata properties (YAML).
      </p>
    </div>
  );
};