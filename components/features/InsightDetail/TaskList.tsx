
import React, { useState } from 'react';
import { CheckSquare, Check, ChevronDown, ChevronUp, ListTodo } from 'lucide-react';
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
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="p-1.5 bg-primary/10 text-primary rounded-lg shadow-inner">
          <ListTodo size={14} strokeWidth={3} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">Action Items</h4>
      </div>

      <div className="bg-surface-container-highest/10 rounded-[2rem] p-10 border border-outline-variant/10 shadow-sm">
        {activeTasks.length > 0 ? (
          <div className="space-y-4">
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
          <div className="text-center py-12 bg-success/5 rounded-[1.5rem] border border-dashed border-success/20">
            <Check size={32} className="mx-auto mb-3 text-success opacity-40" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-success">All steps resolved</p>
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="px-4">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-all"
          >
            {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Resolved Items ({completedTasks.length})
          </button>
          
          {showCompleted && (
            <div className="mt-8 space-y-4 animate-slide-up">
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
