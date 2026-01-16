
import React from 'react';
import { Loader2 } from 'lucide-react';
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

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
         {/* 1. Control Deck */}
         {!isFailed && <QuickActions insight={insight} />}

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 2. Taxonomy Data (Smart Tags only, no manual) */}
         <TaxonomySection topics={insight.topics} entities={[]} />

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 3. Filing System (Folders only) */}
         <div className="space-y-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Filing System</h3>
            <FolderSelection insight={insight} />
         </div>

         <div className="h-px bg-outline-variant/10 w-full" />

         {/* 4. Evidence */}
         <ContextGrounding 
            attachments={insight.metadata?.contextAttachments} 
            sourceUrl={insight.metadata?.sourceDomain || (insight.type === 'URL' ? insight.original_content : undefined)} 
         />
      </div>

      {/* 5. Output Footer */}
      {!isFailed && (
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low shrink-0 z-10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
           <ExportActions insight={insight} />
        </div>
      )}
    </div>
  );
};

export default InfoDrawer;
