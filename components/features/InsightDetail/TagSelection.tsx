
import React from 'react';
import { Plus, Hash, X } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { InsightContent } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

interface TagSelectionProps {
  insight: InsightContent;
}

export const TagSelection: React.FC<TagSelectionProps> = ({ insight }) => {
  const { 
    removeTagFromItemAction, 
    setShowTagManagementModal 
  } = useAppStore();

  const assignedTags = insight.tags || [];

  const handleRemove = (tagId: string) => {
    triggerHaptic('light');
    removeTagFromItemAction(insight.id, tagId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
         <div className="flex items-center gap-2">
            <Hash size={10} className="text-on-surface-variant/40" strokeWidth={3} />
            <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Filing Tags</span>
         </div>
         <button 
          onClick={() => { triggerHaptic('light'); setShowTagManagementModal(true); }}
          className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline"
         >
           Manage Library
         </button>
      </div>
      
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
         {assignedTags.length === 0 ? (
           <p className="text-[9px] font-medium text-on-surface-variant/30 italic px-1">No manual tags linked.</p>
         ) : (
           assignedTags.map(tag => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-surface-container-low border-outline-variant/10 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/80 hover:border-primary/30 transition-all"
              >
                 <span>#{tag.name}</span>
                 <button 
                  onClick={() => handleRemove(tag.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                  aria-label="Remove tag"
                 >
                    <X size={10} strokeWidth={4} />
                 </button>
              </div>
           ))
         )}
         
         <button
            onClick={() => { triggerHaptic('light'); setShowTagManagementModal(true); }}
            className="flex items-center justify-center px-3 h-7 rounded-lg border border-dashed border-outline-variant/30 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95 gap-2"
         >
            <Plus size={10} strokeWidth={3} />
            <span>Link Node</span>
         </button>
      </div>
    </div>
  );
};
