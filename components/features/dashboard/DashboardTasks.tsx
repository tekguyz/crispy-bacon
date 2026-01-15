import React from 'react';
import { ListTodo, Check, Sparkles } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { ExpansionPanel } from '../../ui/ExpansionPanel';
import { InsightContent } from '../../../types';

interface DashboardTasksProps {
  activeTasks: any[];
  isLoading: boolean;
  onSelectInsight: (insight: InsightContent) => void;
}

export const DashboardTasks: React.FC<DashboardTasksProps> = ({ activeTasks, isLoading, onSelectInsight }) => {
  const { toggleActionItemComplete } = useAppStore();

  const handleToggle = (id: string, idx: number) => {
    triggerHaptic('medium');
    toggleActionItemComplete(id, idx);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-3">
              <div className="p-1.5 bg-surface-container-high text-primary rounded-lg shadow-inner">
                <ListTodo size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-on-surface">Tasks</h3>
          </div>
      </div>
      
      <div className="space-y-2">
        <ExpansionPanel title="Active Items" count={activeTasks.length} defaultExpanded={true}>
          <div className="bg-surface-container-low rounded-expressive p-2 shadow-sm border border-outline-variant/10 mt-2">
            {isLoading && activeTasks.length === 0 ? (
              <div className="p-5 space-y-4 animate-skeleton-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-2">
                    <div className="w-5 h-5 skeleton-shimmer shrink-0 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full skeleton-shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTasks.length === 0 ? (
              <div className="py-12 text-center opacity-20">
                <Check strokeWidth={2.5} className="mx-auto mb-4 text-success w-10 h-10" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Queue Clear</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/5">
                {activeTasks.map((item) => (
                  <div 
                    key={`${item.id}-${item.idx}`} 
                    className="flex items-start gap-4 p-4 hover:bg-background rounded-xl transition-all group cursor-pointer active:scale-[0.99] animate-hydrate"
                    onClick={() => { triggerHaptic('light'); onSelectInsight(item.insight); }}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.idx); }}
                      className="mt-1 w-5 h-5 rounded-lg border-2 border-outline-variant flex items-center justify-center shrink-0 group-hover:border-primary transition-all bg-background shadow-inner"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">{item.action}</p>
                      <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest truncate">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ExpansionPanel>

        <ExpansionPanel title="Suggested Actions">
          <div className="p-6 bg-surface-container-highest/5 rounded-2xl border border-dashed border-outline-variant/10 text-center opacity-40">
             <Sparkles size={24} className="mx-auto mb-3 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
               Smart task discovery <br/>requires fresh meeting input.
             </p>
          </div>
        </ExpansionPanel>
      </div>
    </div>
  );
};