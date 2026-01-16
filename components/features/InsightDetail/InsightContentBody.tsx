
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

  return (
    <div className="max-w-4xl mx-auto pb-40 px-4 md:px-0">
      {hasAudio && (
        <AudioSource 
            variant="slim"
            url={insight.metadata!.audioUrl!} 
            title={insight.metadata?.originalName}
        />
      )}

      {/* METADATA RIBBON */}
      <SummaryStats insight={insight} />

      <div className="space-y-24">
        {/* PRIMARY SIGNAL (HERO) */}
        <SummarySection 
            summary={insight.summary} 
            isDeepStrategist={insight.metadata?.isDeepStrategist} 
            onRetry={() => retryProcessing(insight)}
        />
        
        {/* SECONDARY SIGNAL (DENSE LIST) */}
        <TakeawayGrid highlights={insight.highlights} />

        {/* TERTIARY SIGNAL (TASKS) */}
        <TaskList insightId={insight.id} activeTasks={activeTasks} completedTasks={completedTasks} />
      </div>
    </div>
  );
};

export default InsightContentBody;
