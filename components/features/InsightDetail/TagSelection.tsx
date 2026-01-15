
import React from 'react';
import { Tag as TagIcon, Check, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { InsightContent } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

interface TagSelectionProps {
  insight: InsightContent;
}

export const TagSelection: React.FC<TagSelectionProps> = ({ insight }) => {
  const { 
    tags, 
    addTagToItemAction, 
    removeTagFromItemAction, 
    setShowTagManagementModal 
  } = useAppStore();

  const insightTagIds = insight.tags?.map(t => t.id) || [];

  const toggleTag = (tagId: string) => {
    triggerHaptic('light');
    if (insightTagIds.includes(tagId)) {
      removeTagFromItemAction(insight.id, tagId);
    } else {
      addTagToItemAction(insight.id, tagId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
         <span className="text-[8px] font-mono font-bold text-on-surface-variant/30 uppercase tracking-widest">Tags</span>
         <button onClick={() => setShowTagManagementModal(true)} className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline">Manage</button>
      </div>
      
      <div className="flex flex-wrap gap-2">
         {tags.map(tag => {
            const isSelected = insightTagIds.includes(tag.id);
            return (
               <button
                 key={tag.id}
                 onClick={() => toggleTag(tag.id)}
                 className={`group flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${isSelected ? 'bg-secondary text-on-secondary border-secondary shadow-md' : 'bg-transparent border-outline-variant/20 text-on-surface-variant/60 hover:text-on-surface hover:border-secondary/40'}`}
               >
                  {isSelected ? <Check size={10} strokeWidth={4} /> : <span className="opacity-40">#</span>}
                  {tag.name}
               </button>
            );
         })}
         
         <button
            onClick={() => { triggerHaptic('light'); setShowTagManagementModal(true); }}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-dashed border-outline-variant/30 text-on-surface-variant/30 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
         >
            <Plus size={12} strokeWidth={3} />
         </button>
      </div>
    </div>
  );
};
