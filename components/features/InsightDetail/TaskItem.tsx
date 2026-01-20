
import React from 'react';
import { Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

interface TaskItemProps {
  insightId: string;
  item: string;
  index: number;
  isCompleted: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ insightId, item, index, isCompleted }) => {
  const toggleTask = useAppStore(state => state.toggleActionItemComplete);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(isCompleted ? 'light' : 'medium');
    toggleTask(insightId, index);
  };

  return (
    <div 
      onClick={handleToggle}
      className={`
        flex items-center gap-4 md:gap-5 p-5 md:p-6 min-h-[48px] rounded-3xl border transition-all cursor-pointer group active:scale-[0.99] animate-fade-in
        ${isCompleted ? 'bg-surface-container/30 border-outline-variant/5' : 'bg-background border-outline-variant/10 hover:border-primary/40 shadow-sm'}
      `}
    >
      <div className={`
        w-6 h-6 md:w-7 md:h-7 rounded-xl flex items-center justify-center transition-all shadow-inner shrink-0
        ${isCompleted ? 'bg-success animate-spring-scale' : 'border-2 border-outline-variant/40 group-hover:border-primary bg-surface-container-low'}
      `}>
        {isCompleted ? (
          <Check size={14} className="text-surface-container-lowest" strokeWidth={4} />
        ) : (
          <div className="w-2.5 h-2.5 rounded-sm bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
        )}
      </div>
      <div className={`
        text-base font-medium font-sans leading-tight transition-all flex-1
        ${isCompleted ? 'text-on-surface-variant/50 line-through' : 'text-on-surface-variant group-hover:text-primary'}
      `}>
        <MarkdownRenderer content={item} className="inline-markdown" />
      </div>
    </div>
  );
};

export default React.memo(TaskItem);
