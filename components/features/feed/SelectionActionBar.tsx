
import React from 'react';
import { Trash2, Archive, Star, X, RotateCcw, ShieldX, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { AppView } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

export const SelectionActionBar: React.FC = () => {
  const { 
    isSelectionMode, 
    selectedItemIds, 
    clearSelection, 
    bulkDelete, 
    bulkArchive, 
    bulkPin, 
    bulkRestore, 
    bulkDeleteForever,
    view,
    openConfirmation
  } = useAppStore();

  if (!isSelectionMode) return null;

  const count = selectedItemIds.length;
  const isTrashView = view === AppView.TRASH;
  const isArchiveView = view === AppView.ARCHIVED;

  const handleBulkAction = async (actionFn: () => Promise<void>) => {
    triggerHaptic('heavy');
    const idsToProcess = [...selectedItemIds];
    clearSelection();
    await actionFn();
  };

  const handleBulkDelete = () => {
    if (isTrashView) {
      openConfirmation({
        title: 'Delete Forever?',
        message: `Permanently remove ${count} notes? This cannot be undone.`,
        variant: 'danger',
        confirmLabel: 'Delete Forever',
        onConfirm: () => handleBulkAction(() => bulkDeleteForever(selectedItemIds))
      });
    } else {
      handleBulkAction(() => bulkDelete(selectedItemIds));
    }
  };

  const handleBulkArchive = () => {
    handleBulkAction(() => bulkArchive(selectedItemIds, !isArchiveView));
  };

  const handleBulkPin = () => {
    handleBulkAction(() => bulkPin(selectedItemIds, true));
  };

  const handleBulkRestore = () => {
    handleBulkAction(() => bulkRestore(selectedItemIds));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center p-4 md:p-8 pointer-events-none">
      <div className="bg-primary text-on-primary dark:bg-surface-container-high dark:text-on-surface dark:border dark:border-outline-variant/20 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center gap-2 ring-4 ring-black/10 animate-sheet-up pointer-events-auto max-w-full overflow-x-auto no-scrollbar mb-[env(safe-area-inset-bottom)]">
        
        <div className="px-6 py-4 flex items-center gap-4 border-r border-on-primary/20 dark:border-outline-variant/10 shrink-0">
           <div className="w-10 h-10 rounded-2xl bg-on-primary text-primary dark:bg-primary dark:text-on-primary flex items-center justify-center shadow-lg ring-4 ring-on-primary/10 dark:ring-primary/10 animate-spring-scale">
              <Check size={20} strokeWidth={4} />
           </div>
           <div className="flex flex-col leading-none">
              <span className="text-sm font-black uppercase tracking-widest">{count}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Selected</span>
           </div>
        </div>

        <div className="flex items-center gap-1 p-2 pr-4 shrink-0">
          {isTrashView ? (
            <>
              <button 
                onClick={handleBulkRestore}
                className="flex items-center gap-3 h-12 px-5 rounded-2xl hover:bg-on-primary/10 dark:hover:bg-surface-container-highest transition-all text-[10px] font-black uppercase tracking-widest group active:scale-95 text-on-primary dark:text-on-surface"
              >
                <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform icon-tactical" /> 
                <span className="hidden md:inline">Restore</span>
              </button>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-3 h-12 px-5 rounded-2xl hover:bg-white/10 dark:hover:bg-error/10 dark:hover:text-error transition-all text-[10px] font-black uppercase tracking-widest group active:scale-95"
              >
                <ShieldX size={18} className="icon-tactical" /> 
                <span className="hidden md:inline">Delete</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleBulkPin}
                className="flex items-center gap-3 h-12 px-5 rounded-2xl hover:bg-on-primary/10 dark:hover:bg-surface-container-highest transition-all text-[10px] font-black uppercase tracking-widest group active:scale-95 text-on-primary dark:text-on-surface"
              >
                <Star size={18} className="group-hover:scale-110 transition-transform icon-tactical" /> 
                <span className="hidden md:inline">Pin</span>
              </button>
              <button 
                onClick={handleBulkArchive}
                className="flex items-center gap-3 h-12 px-5 rounded-2xl hover:bg-on-primary/10 dark:hover:bg-surface-container-highest transition-all text-[10px] font-black uppercase tracking-widest group active:scale-95 text-on-primary dark:text-on-surface"
              >
                <Archive size={18} className="icon-tactical" /> 
                <span className="hidden md:inline">{isArchiveView ? 'Restore' : 'Archive'}</span>
              </button>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-3 h-12 px-5 rounded-2xl hover:bg-white/10 dark:hover:bg-error/10 dark:hover:text-error transition-all text-[10px] font-black uppercase tracking-widest group active:scale-95 text-on-primary dark:text-on-surface"
              >
                <Trash2 size={18} className="icon-tactical" /> 
                <span className="hidden md:inline">Trash</span>
              </button>
            </>
          )}
        </div>

        <button 
          onClick={() => { triggerHaptic('light'); clearSelection(); }}
          className="w-12 h-12 mr-3 flex items-center justify-center rounded-2xl bg-on-primary/10 hover:bg-white/20 dark:hover:bg-surface-container-highest transition-all active:scale-90 text-on-primary dark:text-on-surface shrink-0"
          title="Clear Selection"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
