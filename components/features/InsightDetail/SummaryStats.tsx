
import React from 'react';
import { Activity, Clock, Calendar, Zap } from 'lucide-react';
import { InsightContent, ProcessingStatus } from '../../../types';

interface SummaryStatsProps {
  insight: InsightContent;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ insight }) => {
  const velocity = insight.metadata?.velocityScore;
  const duration = insight.metadata?.readingTimeMinutes || 1;
  const date = new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const isProcessing = insight.processing_status === ProcessingStatus.PROCESSING;

  const StatItem = ({ icon: Icon, value, label, colorClass = "text-on-surface-variant/20" }: any) => (
    <div className="flex items-center gap-2 group/item">
      <Icon size={11} className={`${colorClass} group-hover/item:text-primary transition-colors`} strokeWidth={2.5} />
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-[10px] font-mono font-black text-on-surface uppercase tracking-tight">{value}</span>
        <span className="text-[7px] font-black text-on-surface-variant opacity-30 uppercase tracking-[0.15em]">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3 border-b border-outline-variant/10 mb-6 animate-fade-in w-full">
       <StatItem icon={Calendar} value={date} label="Captured" />
       
       <StatItem 
          icon={Activity} 
          value={velocity != null ? `${velocity}%` : (isProcessing ? '--' : '50%')} 
          label="Progress" 
          colorClass={velocity && velocity > 70 ? "text-success/40" : "text-primary/20"}
       />

       <StatItem icon={Clock} value={`${duration}m`} label="Read" />

       {insight.metadata?.isDeepStrategist && (
         <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-amber-500/5 text-amber-600 rounded-md border border-amber-500/10 shadow-sm">
            <Zap size={9} fill="currentColor" strokeWidth={0} className="animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.1em]">Executive Tier</span>
         </div>
       )}
    </div>
  );
};
