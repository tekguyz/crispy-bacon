import React from 'react';
import { Loader2, Terminal, ShieldAlert } from 'lucide-react';
import { InsightContent } from '../../../types';
import { ExportActions } from './ExportActions';
import { FolderSelection } from './FolderSelection';
import { TagSelection } from './TagSelection';
import { ContextGrounding } from './ContextGrounding';
import { QuickActions } from './QuickActions';

interface InfoDrawerProps {
  insight: InsightContent;
  isSummarizing: boolean;
  isFailed: boolean;
}

const InfoDrawer: React.FC<InfoDrawerProps> = ({ insight, isSummarizing, isFailed }) => {
  if (isSummarizing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 opacity-40 space-y-4">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Working...</p>
      </div>
    );
  }

  const usage = insight.metadata?.usage;

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        {/* 1. TOP PRIORITY: Core State Actions */}
        {!isFailed && <QuickActions insight={insight} />}

        {/* 2. FILING: Folder and Manual/Auto Tags */}
        <div className="space-y-8 pt-4 border-t border-outline-variant/10">
          <FolderSelection insight={insight} />
          <TagSelection insight={insight} />
        </div>

        {/* 3. PROVENANCE: Source & Grounding */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Sources</h3>
          <ContextGrounding 
            attachments={insight.metadata?.contextAttachments} 
            sourceUrl={insight.metadata?.sourceDomain || (insight.type === 'URL' ? insight.original_content : undefined)} 
          />
        </div>

        {/* 4. DOWNSTREAM: Export Logic */}
        {!isFailed && (
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Export</h3>
            <ExportActions insight={insight} />
          </div>
        )}

        {/* 5. USAGE STATS: Clean System Stats at bottom */}
        <div className="pt-24 pb-8 opacity-30 group/system transition-opacity hover:opacity-70">
          <div className="flex items-center gap-2 mb-3">
             <Terminal size={10} className="text-on-surface-variant" />
             <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em]">System Info</span>
          </div>
          
          {usage ? (
            <div className="font-mono text-[9px] space-y-1.5 font-bold">
              <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                <span className="opacity-50">Model</span>
                <span className="uppercase tracking-tight">{usage.model.replace('gemini-', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Tokens</span>
                <span>{usage.totalTokens.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[8px] font-mono italic opacity-40">
              <span>Usage data unavailable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDrawer;