import React from 'react';
import { Tag as TagIcon, Check, Plus, Hash } from 'lucide-react';
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
      <div className="flex items-center justify-between px-1">
         <div className="flex items-center gap-2">
            <Hash size={10} className="text-primary/40" strokeWidth={3} />
            <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Signal Tags</span>
         </div>
         <button onClick={() => setShowTagManagementModal(true)} className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline">Edit</button>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
         {tags.map(tag => {
            const isSelected = insightTagIds.includes(tag.id);
            return (
               <button
                 key={tag.id}
                 onClick={() => toggleTag(tag.id)}
                 className={`
                    group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all active:scale-95
                    ${isSelected 
                      ? 'bg-on-surface text-surface border-on-surface shadow-md' 
                      : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant/60 hover:text-on-surface hover:border-primary/30'}
                 `}
               >
                  {isSelected && <Check size={10} strokeWidth={4} />}
                  {tag.name}
               </button>
            );
         })}
         
         <button
            onClick={() => { triggerHaptic('light'); setShowTagManagementModal(true); }}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-dashed border-outline-variant/30 text-on-surface-variant/30 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
         >
            <Plus size={12} strokeWidth={3} />
         </button>
      </div>
    </div>
  );
};