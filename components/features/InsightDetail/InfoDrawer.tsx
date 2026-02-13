
import React from 'react';
import { Loader2, Terminal, Radio, Info } from 'lucide-react';
import { InsightContent } from '../../../types';
import { ExportActions } from './ExportActions';
import { FolderSelection } from './FolderSelection';
import { ContextGrounding } from './ContextGrounding';
import { QuickActions } from './QuickActions';
import { TaxonomySection } from './TaxonomySection';
import { AudioSource } from './AudioSource';

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
  const isDeep = !!insight.metadata?.isDeepStrategist;
  const hasAudio = !!insight.metadata?.audioUrl;

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        {/* 1. PRIMARY ACTIONS */}
        {!isFailed && <QuickActions insight={insight} />}

        {/* 2. SOURCE AUDIO */}
        {hasAudio && (
           <div className="pt-4 border-t border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3 px-1">
                 <Radio size={10} className="text-on-surface-variant/40" strokeWidth={3} />
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">Source Audio</h3>
              </div>
              <AudioSource 
                  variant="slim"
                  url={insight.metadata!.audioUrl!} 
                  title={insight.metadata?.originalName}
              />
           </div>
        )}

        {/* 3. TOPICS */}
        <div className="space-y-8 pt-4 border-t border-outline-variant/10">
          <TaxonomySection 
            topics={insight.topics} 
            entities={insight.entities} 
            isDeepStrategist={isDeep} 
          />
        </div>

        {/* 4. FOLDERS */}
        <div className="space-y-8 pt-4 border-t border-outline-variant/10">
          <FolderSelection insight={insight} />
        </div>

        {/* 5. SOURCES */}
        <ContextGrounding 
          attachments={insight.metadata?.contextAttachments} 
          sourceUrl={insight.metadata?.sourceDomain || (insight.type === 'URL' ? insight.original_content : undefined)} 
        />

        {/* 6. EXPORT */}
        {!isFailed && (
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Export Note</h3>
            <ExportActions insight={insight} />
          </div>
        )}

        {/* 7. FILE PROPERTIES */}
        <div className="pt-24 pb-8 opacity-10 hover:opacity-40 transition-opacity">
          <div className="flex items-center gap-2 mb-3">
             <Terminal size={10} className="text-on-surface-variant" />
             <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em]">File Properties</span>
          </div>
          
          {usage ? (
            <div className="font-mono text-[9px] space-y-1.5 font-bold">
              <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                <span className="opacity-50">Model</span>
                <span className="uppercase tracking-tight">{usage.model.replace('gemini-', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Volume</span>
                <span>{usage.totalTokens.toLocaleString()} tokens</span>
              </div>
            </div>
          ) : (
            <div className="text-[8px] font-mono italic opacity-40 uppercase tracking-widest">
              Standard Note
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDrawer;
