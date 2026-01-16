
import React from 'react';
import { FileText, Copy, Check, PenTool, Hash } from 'lucide-react';
import { InsightContent } from '../../../types';
import { generateInsightMarkdownReport } from '../../../services/dataTransformers';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';

interface ExportActionsProps {
  insight: InsightContent;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ insight }) => {
  const [copiedNotion, setCopiedNotion] = React.useState(false);
  const [copiedObsidian, setCopiedObsidian] = React.useState(false);
  const addToast = useAppStore(state => state.addToast);

  const getMarkdown = () => {
    return generateInsightMarkdownReport(insight);
  };

  const copyToClipboard = async (text: string, type: 'notion' | 'obsidian') => {
    triggerHaptic('light');
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'notion') {
        setCopiedNotion(true);
        setTimeout(() => setCopiedNotion(false), 2000);
      } else {
        setCopiedObsidian(true);
        setTimeout(() => setCopiedObsidian(false), 2000);
      }
      addToast(`${type === 'notion' ? 'Notion' : 'Obsidian'} format copied.`, 'success');
    } catch (err) {
      addToast('Copy failed.', 'error');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => copyToClipboard(getMarkdown(), 'notion')}
          className="flex items-center justify-center gap-3 p-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl hover:bg-surface-container-highest transition-all group active:scale-[0.98]"
        >
          {copiedNotion ? <Check size={16} className="text-success" strokeWidth={3} /> : <PenTool size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />}
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Notion Format</span>
        </button>

        <button 
          onClick={() => copyToClipboard(getMarkdown(), 'obsidian')}
          className="flex items-center justify-center gap-3 p-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl hover:bg-surface-container-highest transition-all group active:scale-[0.98]"
        >
          {copiedObsidian ? <Check size={16} className="text-success" strokeWidth={3} /> : <Hash size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />}
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Obsidian Format</span>
        </button>
    </div>
  );
};
