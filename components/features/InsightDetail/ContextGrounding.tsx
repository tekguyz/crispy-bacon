
import React from 'react';
import { Paperclip, Link as LinkIcon, FileText, Sparkles, Globe, ExternalLink } from 'lucide-react';
import { ContextAttachment } from '../../../types';

interface ContextGroundingProps {
  attachments?: ContextAttachment[];
  sourceUrl?: string;
}

export const ContextGrounding: React.FC<ContextGroundingProps> = ({ attachments = [], sourceUrl }) => {
  const hasAttachments = attachments.length > 0;
  const hasUrl = !!sourceUrl;

  if (!hasAttachments && !hasUrl) return null;

  return (
    <section className="space-y-4 pt-4 border-t border-outline-variant/10">
      <div className="flex items-center gap-2 px-1">
         <Paperclip size={10} className="text-on-surface-variant/40" strokeWidth={3} />
         <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">Provenance</h3>
      </div>

      <div className="space-y-2">
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:border-primary/30 transition-all group">
             <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                <Globe size={14} />
             </div>
             <div className="min-w-0 flex-1">
                <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest block mb-0.5">Original Link</span>
                <p className="text-[10px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">{sourceUrl}</p>
             </div>
             <ExternalLink size={10} className="text-on-surface-variant/20 group-hover:text-primary" />
          </a>
        )}

        {attachments.map((att) => (
          <div key={att.id} className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/10 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-on-surface-variant/60">
              {att.type === 'LINK' && <LinkIcon size={14} />}
              {att.type === 'FILE' && <FileText size={14} />}
              {att.type === 'INSIGHT' && <Sparkles size={14} />}
            </div>
            <div className="min-w-0 flex-1">
               <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest block mb-0.5">{att.type}</span>
               <p className="text-[10px] font-bold text-on-surface truncate">{att.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
