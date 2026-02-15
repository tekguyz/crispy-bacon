
import React from 'react';
import { Activity, Clock, Calendar, Zap, Mic, HelpCircle } from 'lucide-react';
import { InsightContent, ProcessingStatus, ContentType } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';

interface SummaryStatsProps {
  insight: InsightContent;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ insight }) => {
  const velocity = insight.metadata?.velocityScore;
  const readingTime = insight.metadata?.readingTimeMinutes || 0;
  const sourceDurationSeconds = insight.metadata?.durationSeconds || 0;
  const date = new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const isProcessing = insight.processing_status === ProcessingStatus.PROCESSING;
  const isDeep = !!insight.metadata?.isDeepStrategist;

  const StatItem = ({ icon: Icon, value, label, colorClass = "text-on-surface-variant/20" }: any) => (
    <div className="flex items-center gap-2 group/item">
      <Icon size={11} className={`${colorClass} group-hover/item:text-primary transition-colors`} strokeWidth={2.5} />
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-[10px] font-mono font-black text-on-surface uppercase tracking-tight">{value}</span>
        <span className="text-[7px] font-black text-on-surface-variant opacity-30 uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );

  const Divider = () => <div className="h-3 w-px bg-outline-variant/10 hidden sm:block mx-1" />;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-b border-outline-variant/10 mb-8 animate-fade-in w-full">
       <StatItem icon={Calendar} value={date} label="Captured" />
       
       <Divider />

       <Tooltip content="Clarity Score (0-100%)">
         <StatItem 
            icon={Activity} 
            value={velocity != null ? `${velocity}%` : (isProcessing ? '--' : '50%')} 
            label="Clarity" 
            colorClass={velocity && velocity > 70 ? "text-success/40" : (velocity && velocity < 20 ? "text-error" : "text-primary/20")}
         />
       </Tooltip>

       <Divider />

       <StatItem 
          icon={Clock} 
          value={`${readingTime}m`} 
          label="Read Time" 
       />

       {sourceDurationSeconds > 0 && insight.type === ContentType.MEETING && (
         <>
           <Divider />
           <StatItem 
              icon={Mic} 
              value={`${Math.ceil(sourceDurationSeconds / 60)}m`} 
              label="Duration" 
           />
         </>
       )}

       {isDeep ? (
         <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-primary text-on-primary rounded-md shadow-sm">
            <Zap size={9} fill="currentColor" strokeWidth={0} className="animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Deep Mode</span>
         </div>
       ) : (
         <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-surface-container-high text-on-surface-variant/60 rounded-md border border-outline-variant/20 shadow-inner">
            <Activity size={9} strokeWidth={3} />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Concise</span>
         </div>
       )}
    </div>
  );
};
