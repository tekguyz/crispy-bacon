
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

  const StatItem = ({ icon: Icon, value, label, colorClass = "text-on-surface-variant/30" }: any) => (
    <div className="flex items-center gap-2 group/item">
      <Icon size={12} className={`${colorClass} group-hover/item:text-primary transition-colors`} strokeWidth={3} />
      <div className="flex flex-col md:flex-row md:items-baseline gap-x-1.5 leading-none">
        <span className="text-[11px] font-mono font-black text-on-surface uppercase tracking-tight">{value}</span>
        <span className="text-[8px] font-black text-on-surface-variant opacity-30 uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-12 gap-y-4 py-6 border-b border-outline-variant/10 mb-12 animate-fade-in">
       <StatItem icon={Calendar} value={date} label="Captured" />
       
       <StatItem 
          icon={Activity} 
          value={velocity != null ? `${velocity}%` : (isProcessing ? '--' : '50%')} 
          label="Progress" 
          colorClass={velocity && velocity > 70 ? "text-success" : "text-primary/40"}
       />

       <StatItem icon={Clock} value={`${duration}m`} label="Reading Time" />

       {insight.metadata?.isDeepStrategist && (
         <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 text-amber-600 rounded-lg border border-amber-500/20 shadow-sm">
            <Zap size={10} fill="currentColor" strokeWidth={0} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Executive Reasoning</span>
         </div>
       )}
    </div>
  );
};
