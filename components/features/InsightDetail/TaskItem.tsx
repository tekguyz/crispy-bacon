
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
        flex items-start gap-4 px-4 py-4 rounded-xl border transition-all cursor-pointer group active:scale-[0.99] animate-fade-in
        ${isCompleted ? 'bg-surface-container/20 border-transparent opacity-60' : 'bg-background border-outline-variant/5 hover:border-primary/30 shadow-sm'}
      `}
    >
      <div className={`
        w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5
        ${isCompleted ? 'bg-success' : 'border-2 border-outline/40 group-hover:border-primary bg-surface-container-low group-hover:bg-primary/5'}
      `}>
        {isCompleted ? (
          <Check size={10} className="text-white" strokeWidth={5} />
        ) : (
          <div className="w-2 h-2 rounded-sm bg-primary opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
        )}
      </div>
      
      {/* Font Weight adjusted from bold to medium/semibold for better visual balance */}
      <div className={`
        text-sm font-semibold font-sans leading-relaxed transition-all flex-1
        ${isCompleted ? 'text-on-surface-variant/40 line-through' : 'text-on-surface-variant group-hover:text-on-surface'}
      `}>
        <MarkdownRenderer content={item} className="inline-markdown" />
      </div>
    </div>
  );
};

export default React.memo(TaskItem);
