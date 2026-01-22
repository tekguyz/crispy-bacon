
import React from 'react';
import { InsightContent } from '../../../types';
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
  const isDeep = !!insight.metadata?.isDeepStrategist;

  return (
    // Expanded max-width from 3xl to 5xl to fill the view
    <div className="max-w-5xl mx-auto pb-40 px-4 md:px-0">
      {/* METADATA RIBBON */}
      <SummaryStats insight={insight} />

      <div className="flex flex-col gap-12">
        {/* PRIMARY SIGNAL LAYER */}
        <div className="w-full">
           <SummarySection 
              summary={insight.summary} 
              isDeepStrategist={isDeep} 
              onRetry={() => retryProcessing(insight)}
          />
        </div>

        {/* FACT LAYER */}
        <TakeawayGrid highlights={insight.highlights} />

        {/* DECISION LAYER */}
        <TaskList insightId={insight.id} activeTasks={activeTasks} completedTasks={completedTasks} />
      </div>
    </div>
  );
};

export default InsightContentBody;
