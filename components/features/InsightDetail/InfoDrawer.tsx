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
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Processing Metadata...</p>
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
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Provenance</h3>
          <ContextGrounding 
            attachments={insight.metadata?.contextAttachments} 
            sourceUrl={insight.metadata?.sourceDomain || (insight.type === 'URL' ? insight.original_content : undefined)} 
          />
        </div>

        {/* 4. DOWNSTREAM: Export Logic */}
        {!isFailed && (
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Tool Bridge</h3>
            <ExportActions insight={insight} />
          </div>
        )}

        {/* 5. GHOST TELEMETRY: System Stats at bottom */}
        <div className="pt-24 pb-8 opacity-20 group/system transition-opacity hover:opacity-50">
          <div className="flex items-center gap-2 mb-3">
             <Terminal size={10} className="text-on-surface-variant" />
             <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em]">Sys_Telemetry</span>
          </div>
          
          {usage ? (
            <div className="font-mono text-[8px] space-y-1.5">
              <div className="flex justify-between border-b border-outline-variant/5 pb-1">
                <span className="opacity-40">MODEL_ID</span>
                <span className="font-black uppercase tracking-tighter">{usage.model.replace('gemini-', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">IO_PAIR</span>
                <span>{usage.inputTokens} / {usage.outputTokens}</span>
              </div>
              <div className="flex justify-between font-black text-primary">
                <span>BURN_WEIGHT</span>
                <span>{usage.totalTokens}t</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[8px] font-mono italic opacity-40">
              <ShieldAlert size={10} />
              <span>Link_Terminated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDrawer;