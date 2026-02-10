
import React from 'react';
import { Folder, Check, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { InsightContent } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

interface FolderSelectionProps {
  insight: InsightContent;
}

export const FolderSelection: React.FC<FolderSelectionProps> = ({ insight }) => {
  const { 
    collections, 
    addItemToCollectionAction, 
    removeItemFromCollectionAction, 
    setShowCollectionManagementModal 
  } = useAppStore();

  const insightCollectionIds = insight.collections?.map(c => c.id) || [];

  const toggleCollection = (colId: string) => {
    triggerHaptic('light');
    if (insightCollectionIds.includes(colId)) {
      removeItemFromCollectionAction(insight.id, colId);
    } else {
      addItemToCollectionAction(insight.id, colId);
    }
  };

  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono font-bold text-on-surface-variant/30 uppercase tracking-widest">Folders</span>
          <button onClick={() => setShowCollectionManagementModal(true)} className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline">Manage</button>
       </div>
       
       <div className="flex flex-wrap gap-2">
          {collections.map(col => {
             const isSelected = insightCollectionIds.includes(col.id);
             return (
               <button
                 key={col.id}
                 onClick={() => toggleCollection(col.id)}
                 className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-transparent border-outline-variant/20 text-on-surface-variant/60 hover:text-on-surface hover:border-primary/30'}`}
               >
                  {isSelected ? <Check size={10} strokeWidth={4} /> : <Folder size={10} />}
                  {col.name}
               </button>
             );
          })}
          <button
            onClick={() => { triggerHaptic('light'); setShowCollectionManagementModal(true); }}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-dashed border-outline-variant/30 text-on-surface-variant/30 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
          >
            <Plus size={12} strokeWidth={3} />
          </button>
       </div>
    </div>
  );
};
