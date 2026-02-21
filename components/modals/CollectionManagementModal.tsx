
import React, { useState, useCallback } from 'react';
import { X, Plus, Pencil, Trash2, Loader2, Check, Folder } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useCollectionsQuery } from '../../hooks/useQueries';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const CollectionManagementModal: React.FC = () => {
  const { 
    setShowCollectionManagementModal,
    createCollectionAction,
    updateCollectionAction,
    deleteCollectionAction,
    openConfirmation
  } = useAppStore();

  const { data: collections = [] } = useCollectionsQuery();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionName, setEditingCollectionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setShowCollectionManagementModal(false);
  }, [setShowCollectionManagementModal]);

  const containerRef = useFocusTrap(true, handleClose);

  const handleCreate = async () => {
    if (!newCollectionName.trim()) {
      setError('Collection name required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createCollectionAction(newCollectionName);
      setNewCollectionName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create collection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingCollectionName.trim()) {
      setError('Collection name required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateCollectionAction(id, editingCollectionName);
      setEditingCollectionId(null);
      setEditingCollectionName('');
    } catch (err: any) {
      setError(err.message || 'Failed to update collection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    openConfirmation({
      title: 'Delete Folder?',
      message: `Remove "${name}"? Notes will remain in history.`,
      variant: 'danger',
      onConfirm: async () => {
        setLoading(true);
        setError(null);
        try {
          await deleteCollectionAction(id, name);
        } catch (err: any) {
          setError(err.message || 'Failed to delete collection.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[210] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="bg-background w-[calc(100%-2rem)] md:max-w-lg rounded-[2.5rem] max-h-[90dvh] shadow-2xl flex flex-col animate-sheet-up md:animate-scale-in overflow-hidden focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-management-title"
      >
        {/* M3 Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2 shrink-0">
           <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between p-6 border-b border-outline-variant/5 bg-surface-container-low flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Folder size={16} strokeWidth={2.5} />
             </div>
             <h2 id="collection-management-title" className="text-base font-black uppercase tracking-tight">Manage Folders</h2>
          </div>
          <button
              onClick={handleClose}
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none border border-outline-variant/10"
              aria-label="Close"
          >
              <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-on-surface custom-scrollbar relative bg-background">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10" role="status">
              <Loader2 className="animate-spin text-primary" size={32} aria-hidden="true" />
            </div>
          )}

          {error && <p className="text-error text-[10px] font-black uppercase mb-4 bg-error/5 p-3 rounded-lg border border-error/20" role="alert">{error}</p>}

          <div className="mb-8 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-surface-container-high border-2 border-outline-variant/10 rounded-xl px-4 h-14 md:h-12 text-sm font-bold text-on-surface focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-on-surface-variant/40"
              placeholder="New folder name..."
              value={newCollectionName}
              onChange={(e) => { setNewCollectionName(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              aria-label="New collection name"
              disabled={loading}
            />
            <button
              onClick={handleCreate}
              className="px-5 h-14 md:h-12 bg-primary text-on-primary hover:brightness-110 text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
              disabled={loading || !newCollectionName.trim()}
            >
              <Plus size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 px-1">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-40">Existing Folders</span>
                <div className="h-px flex-1 bg-outline-variant/10" />
             </div>
             
             {collections.length === 0 ? (
               <p className="text-on-surface-variant/40 text-center py-8 italic text-xs font-bold uppercase tracking-widest">No folders yet.</p>
             ) : (
               <ul className="space-y-2">
                 {collections.map((collection) => (
                   <li key={collection.id} className="flex items-center justify-between bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 group">
                     {editingCollectionId === collection.id ? (
                       <input
                         type="text"
                         value={editingCollectionName}
                         onChange={(e) => { setEditingCollectionName(e.target.value); setError(null); }}
                         onKeyDown={(e) => e.key === 'Enter' && handleUpdate(collection.id)}
                         className="flex-1 bg-background border-2 border-primary/20 rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:outline-none mr-2"
                         disabled={loading}
                         autoFocus
                       />
                     ) : (
                       <span className="text-on-surface text-sm font-bold uppercase tracking-tight">{collection.name}</span>
                     )}
                     <div className="flex gap-1 shrink-0">
                       {editingCollectionId === collection.id ? (
                         <button
                           onClick={() => handleUpdate(collection.id)}
                           className="p-3 rounded-lg text-success hover:bg-success/10 transition-colors"
                           disabled={loading}
                         >
                           <Check size={20} strokeWidth={4} />
                         </button>
                       ) : (
                         <button
                           onClick={() => { setEditingCollectionId(collection.id); setEditingCollectionName(collection.name); setError(null); }}
                           className="p-3 rounded-lg text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                           disabled={loading}
                         >
                           <Pencil size={20} strokeWidth={2.5} />
                         </button>
                       )}
                       <button
                         onClick={() => handleDelete(collection.id, collection.name)}
                         className="p-3 rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/5 transition-colors"
                         disabled={loading}
                       >
                         <Trash2 size={20} strokeWidth={2.5} />
                       </button>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low flex justify-end shrink-0 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:pb-4">
          <button
            onClick={handleClose}
            className="w-full md:w-auto px-10 h-14 md:h-12 bg-on-surface text-surface font-black text-[11px] md:text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
            disabled={loading}
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionManagementModal;
