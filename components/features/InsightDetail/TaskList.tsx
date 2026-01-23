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
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shadow-inner border border-primary/10">
                <ListTodo size={14} strokeWidth={3} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface leading-none">Decision Checklist</h4>
        </div>
        <span className="text-[8px] font-mono font-black text-on-surface-variant opacity-30 uppercase tracking-widest">
            {activeTasks.length} Pending Actions
        </span>
      </div>

      <div className="bg-surface-container-low border-2 border-on-surface/5 rounded-[2.5rem] py-6 md:py-10 shadow-m3-1 relative overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
        
        {activeTasks.length > 0 ? (
          <div className="space-y-3 relative z-10">
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
          <div className="text-center py-16 bg-success/5 rounded-[2rem] border-2 border-dashed border-success/20 relative z-10 mx-6">
            <CheckCircle2 size={40} className="mx-auto mb-4 text-success opacity-40 animate-pulse" />
            <h5 className="text-lg font-black uppercase tracking-tight text-on-surface mb-1">Queue Empty.</h5>
            <p className="text-[10px] font-bold text-success uppercase tracking-widest">All strategic decisions resolved</p>
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="px-4">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40 hover:text-primary transition-all group py-2"
          >
            <div className={`p-1 rounded-md border border-outline-variant/20 transition-all ${showCompleted ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container-high'}`}>
                {showCompleted ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
            </div>
            Archived Items ({completedTasks.length})
          </button>
          
          {showCompleted && (
            <div className="mt-6 space-y-3 animate-slide-up">
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