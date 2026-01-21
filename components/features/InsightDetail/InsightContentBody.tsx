
import React from 'react';
import { InsightContent } from '../../../types';
import { AudioSource } from './AudioSource';
import SummarySection from './SummarySection';
import TakeawayGrid from './TakeawayGrid';
import TaskList from './TaskList';
import { SummaryStats } from './SummaryStats';

interface InsightContentBodyProps {
  insight: InsightContent;
  activeTasks: any[];
  completedTasks: any[];
  retryProcessing: (insight: InsightContent) => void;
}

export const InsightContentBody: React.FC<InsightContentBodyProps> = ({ 
  insight, activeTasks, completedTasks, retryProcessing 
}) => {
  const hasAudio = !!insight.metadata?.audioUrl;
  const isDeep = !!insight.metadata?.isDeepStrategist;

  return (
    <div className={`max-w-7xl mx-auto pb-40 px-4 md:px-8`}>
      {hasAudio && (
        <AudioSource 
            variant="slim"
            url={insight.metadata!.audioUrl!} 
            title={insight.metadata?.originalName}
        />
      )}

      {/* METADATA RIBBON */}
      <SummaryStats insight={insight} />

      <div className="flex flex-col gap-24">
        {/* Bifurcated Layout for Deep Distill */}
        <div className={`grid grid-cols-1 ${isDeep ? 'lg:grid-cols-12 gap-12 lg:gap-16' : 'max-w-4xl mx-auto w-full gap-24'}`}>
          <div className={isDeep ? 'lg:col-span-7' : ''}>
             <SummarySection 
                summary={insight.summary} 
                isDeepStrategist={isDeep} 
                onRetry={() => retryProcessing(insight)}
            />
          </div>
          
          <div className={isDeep ? 'lg:col-span-5' : ''}>
             <div className={`${isDeep ? 'lg:sticky lg:top-8' : ''}`}>
                <TakeawayGrid highlights={insight.highlights} />
                {isDeep && (
                   <div className="mt-12 pt-12 border-t border-outline-variant/10 hidden lg:block">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-20 mb-6">Strategic Context</p>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-on-surface-variant">
                            <span className="opacity-40">Knowledge Density</span>
                            <span className="text-primary">{insight.highlights?.length || 0} Factors</span>
                         </div>
                         <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (insight.highlights?.length || 0) * 10)}%` }} />
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* PRIMARY SIGNAL (TASKS) */}
        <div className="max-w-4xl mx-auto w-full">
          <TaskList insightId={insight.id} activeTasks={activeTasks} completedTasks={completedTasks} />
        </div>
      </div>
    </div>
  );
};

export default InsightContentBody;
