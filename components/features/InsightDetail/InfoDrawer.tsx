
import React from 'react';
import { Loader2, Terminal, Cpu, Zap, Info as InfoIcon, ShieldAlert } from 'lucide-react';
import { InsightContent } from '../../../types';
import { ExportActions } from './ExportActions';
import { FolderSelection } from './FolderSelection';
import { TaxonomySection } from './TaxonomySection';
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
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Extracting Metadata...</p>
        </div>
    );
  }

  const usage = insight.metadata?.usage;

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
         {/* 1. Control Deck */}
         {!isFailed && <QuickActions insight={insight} />}

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 2. Telemetry */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-primary" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">Hardware Telemetry</h3>
               </div>
               <a 
                 href="https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[7px] font-black text-primary hover:underline uppercase tracking-widest"
               >
                 GCP Log
               </a>
            </div>

            {usage ? (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 font-mono space-y-2.5 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-on-surface-variant opacity-40 uppercase">Model</span>
                     <span className="text-on-surface font-bold uppercase">{usage.model.replace('gemini-', '')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-on-surface-variant opacity-40 uppercase">In/Out</span>
                     <span className="text-on-surface font-bold">{usage.inputTokens.toLocaleString()} / {usage.outputTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-on-surface-variant opacity-40 uppercase">Tokens</span>
                     <span className="text-primary font-black">{usage.totalTokens.toLocaleString()}</span>
                  </div>
                  {usage.estimatedCost !== undefined && (
                    <div className="pt-2 border-t border-outline-variant/5 flex justify-between items-center text-[10px]">
                       <span className="text-on-surface-variant opacity-40 uppercase">Est. Cost</span>
                       <span className="text-success font-black">${usage.estimatedCost.toFixed(4)}</span>
                    </div>
                  )}
              </div>
            ) : (
              <div className="p-4 bg-surface-container rounded-xl border border-dashed border-outline-variant/10 flex flex-col items-center gap-2 text-center opacity-40">
                 <ShieldAlert size={16} />
                 <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed">
                   Telemetry is only captured for sessions processed after v2.5.1
                 </p>
              </div>
            )}
         </div>

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 3. Taxonomy Data */}
         <TaxonomySection topics={insight.topics} entities={[]} />

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 4. Filing System */}
         <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Filing System</h3>
            <FolderSelection insight={insight} />
         </div>

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 5. Evidence */}
         <ContextGrounding 
            attachments={insight.metadata?.contextAttachments} 
            sourceUrl={insight.metadata?.sourceDomain || (insight.type === 'URL' ? insight.original_content : undefined)} 
         />
      </div>

      {/* Footer */}
      {!isFailed && (
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low shrink-0 z-10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
           <ExportActions insight={insight} />
        </div>
      )}
    </div>
  );
};

export default InfoDrawer;