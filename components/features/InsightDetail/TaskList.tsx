
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ListTodo, CheckCircle2 } from 'lucide-react';
import TaskItem from './TaskItem';

interface Task {
  item: string;
  index: number;
}

interface TaskListProps {
  insightId: string;
  activeTasks: Task[];
  completedTasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ insightId, activeTasks, completedTasks }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  if (activeTasks.length === 0 && completedTasks.length === 0) return null;

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
            <div className="p-1 bg-surface-container-high text-primary rounded border border-outline-variant/20 shadow-inner">
                <ListTodo size={12} strokeWidth={3} />
            </div>
            <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.35em] text-on-surface-variant opacity-40 leading-none">Decision Checklist</h4>
        </div>
        <span className="text-[8px] font-mono font-bold text-on-surface-variant opacity-20 uppercase tracking-widest">
            {activeTasks.length} Pending
        </span>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/10 rounded-[1.5rem] p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />
        
        {activeTasks.length > 0 ? (
          <div className="space-y-1.5 relative z-10">
            {activeTasks.map(({ item, index }) => (
              <TaskItem 
                key={index}
                insightId={insightId}
                item={item}
                index={index}
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-success/5 rounded-xl border border-dashed border-success/20 relative z-10">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-success opacity-30" />
            <h5 className="text-sm font-black uppercase tracking-tight text-on-surface">Queue Empty.</h5>
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="px-2">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-primary transition-all group py-2"
          >
            <div className={`p-1 rounded transition-all ${showCompleted ? 'text-primary' : 'opacity-40'}`}>
                {showCompleted ? <ChevronUp size={10} strokeWidth={4} /> : <ChevronDown size={10} strokeWidth={4} />}
            </div>
            Completed ({completedTasks.length})
          </button>
          
          {showCompleted && (
            <div className="mt-2 space-y-1 animate-slide-up">
              {completedTasks.map(({ item, index }) => (
                <TaskItem 
                  key={index}
                  insightId={insightId}
                  item={item}
                  index={index}
                  isCompleted={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default React.memo(TaskList);
