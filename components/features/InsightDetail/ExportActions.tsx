
import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { InsightContent } from '../../../types';
import { generateInsightMarkdownReport } from '../../../services/dataTransformers';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';

interface ExportActionsProps {
  insight: InsightContent;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ insight }) => {
  const [copied, setCopied] = React.useState(false);
  const addToast = useAppStore(state => state.addToast);

  const handleDownloadMarkdown = () => {
    triggerHaptic('light');
    try {
      const markdown = generateInsightMarkdownReport(insight);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${insight.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recap.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Markdown export ready.', 'success');
    } catch (err) {
      addToast('Export failed.', 'error');
    }
  };

  const handleCopy = () => {
    triggerHaptic('light');
    const text = `
RESEARCH SUMMARY: ${insight.title}
SOURCE: ${insight.site_name || 'Manual Ingest'}
DATE: ${new Date(insight.created_at).toLocaleDateString()}

SUMMARY:
${insight.summary}

KEY TAKEAWAYS:
${insight.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

ACTION ITEMS:
${insight.action_items.map((a, i) => `[ ] ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 p-3 bg-surface-container-high border border-outline-variant/10 rounded-xl hover:bg-surface-container-highest transition-all group active:scale-95"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-on-surface-variant group-hover:text-primary" />}
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">Copy</span>
        </button>

        <button 
          onClick={handleDownloadMarkdown}
          className="flex items-center justify-center gap-2 p-3 bg-surface-container-high border border-outline-variant/10 rounded-xl hover:bg-surface-container-highest transition-all group active:scale-95"
        >
          <FileText size={14} className="text-on-surface-variant group-hover:text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">Markdown</span>
        </button>
    </div>
  );
};
