import React, { useState } from 'react';
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
  const [completing, setCompleting] = useState<Set<string>>(new Set());

  const handleToggle = async (id: string, idx: number) => {
    // Prevent double clicks
    if (completing.has(`${id}-${idx}`)) return;

    triggerHaptic('medium');
    
    // Optimistic UI update
    setCompleting(prev => new Set(prev).add(`${id}-${idx}`));

    // Small delay to show the animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    await toggleActionItemComplete(id, idx);
    
    // Cleanup (though item will likely disappear)
    setCompleting(prev => {
      const next = new Set(prev);
      next.delete(`${id}-${idx}`);
      return next;
    });
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
                {activeTasks.map((item) => {
                  const isCompleting = completing.has(`${item.id}-${item.idx}`);
                  return (
                    <div 
                      key={`${item.id}-${item.idx}`} 
                      className={`
                        flex items-start gap-4 p-4 hover:bg-background rounded-xl transition-all group cursor-pointer active:scale-[0.99] animate-hydrate
                        ${isCompleting ? 'opacity-50 bg-background' : ''}
                      `}
                      onClick={() => { 
                        if (!isCompleting) {
                          triggerHaptic('light'); 
                          onSelectInsight(item.insight); 
                        }
                      }}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.idx); }}
                        className={`
                          mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all shadow-inner
                          ${isCompleting 
                            ? 'bg-success border-success scale-110' 
                            : 'bg-background border-outline-variant group-hover:border-primary'
                          }
                        `}
                      >
                        <Check 
                          size={12} 
                          className={`text-white transition-all duration-300 ${isCompleting ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                          strokeWidth={4} 
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold text-on-surface leading-tight mb-1 transition-colors line-clamp-2 ${isCompleting ? 'line-through text-on-surface-variant' : 'group-hover:text-primary'}`}>
                          {item.action}
                        </p>
                        <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest truncate">{item.title}</p>
                      </div>
                    </div>
                  );
                })}
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