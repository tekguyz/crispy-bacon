
import React, { useMemo } from 'react';
import { History, Activity, ChevronRight } from 'lucide-react';
import InsightCard from '../InsightCard';
import SkeletonCard from '../SkeletonCard';
import { ExpansionPanel } from '../../ui/ExpansionPanel';
import { InsightContent } from '../../../types';

interface DashboardHistoryProps {
  insights: InsightContent[];
  isLoading: boolean;
  onSelectInsight: (insight: InsightContent) => void;
}

export const DashboardHistory: React.FC<DashboardHistoryProps> = ({ insights, isLoading, onSelectInsight }) => {
  const grouped = useMemo(() => {
    const today: InsightContent[] = [];
    const yesterday: InsightContent[] = [];
    const lastWeek: InsightContent[] = [];
    const earlier: InsightContent[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOfLastWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;

    insights.forEach(insight => {
      const ts = new Date(insight.created_at).getTime();
      if (ts >= startOfToday) today.push(insight);
      else if (ts >= startOfYesterday) yesterday.push(insight);
      else if (ts >= startOfLastWeek) lastWeek.push(insight);
      else earlier.push(insight);
    });

    return { today, yesterday, lastWeek, earlier };
  }, [insights]);

  if (isLoading && insights.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <History size={18} className="text-primary" />
          <h3 className="font-slab font-bold text-xl text-on-surface tracking-tight uppercase">Timeline</h3>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  const renderGroup = (items: InsightContent[]) => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-2">
      {items.map(insight => (
        <div key={insight.id} onClick={(e) => { e.stopPropagation(); onSelectInsight(insight); }} className="cursor-pointer group/card">
           <InsightCard insight={insight} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-6 px-1">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shadow-inner">
               <History size={16} strokeWidth={2.5} />
            </div>
            <h3 className="font-slab font-bold text-xl text-on-surface tracking-tight uppercase">Signals</h3>
         </div>
      </div>
      
      <div className="space-y-2">
        {grouped.today.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 opacity-40 px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Today</span>
              <div className="h-px flex-1 bg-outline-variant/10" />
            </div>
            {renderGroup(grouped.today)}
          </div>
        )}
        
        {grouped.yesterday.length > 0 && (
          <ExpansionPanel title="Yesterday" count={grouped.yesterday.length} defaultExpanded={grouped.today.length === 0}>
            {renderGroup(grouped.yesterday)}
          </ExpansionPanel>
        )}

        {grouped.lastWeek.length > 0 && (
          <ExpansionPanel title="Last Week" count={grouped.lastWeek.length}>
            {renderGroup(grouped.lastWeek)}
          </ExpansionPanel>
        )}

        {grouped.earlier.length > 0 && (
          <ExpansionPanel title="Earlier" count={grouped.earlier.length}>
            {renderGroup(grouped.earlier)}
          </ExpansionPanel>
        )}

        {insights.length === 0 && (
          <div className="py-24 bg-surface-container-low/50 rounded-[var(--radius-card)] border border-dashed border-outline-variant/10 flex flex-col items-center justify-center opacity-20">
             <Activity size={40} strokeWidth={1} className="mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Vault is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};
