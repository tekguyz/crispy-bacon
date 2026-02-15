
import React from 'react';
import { Folder, Settings2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { AppView } from '../../../types';

interface CollectionVaultProps {
  isExpanded: boolean;
  onCloseMobile: () => void;
}

export const CollectionVault: React.FC<CollectionVaultProps> = ({
  isExpanded,
  onCloseMobile
}) => {
  const {
    collections,
    activeCollectionFilterId,
    setActiveCollectionFilterId,
    setView,
    setShowCollectionManagementModal
  } = useAppStore();

  if (!isExpanded) return null;

  const handleCollectionClick = (colId: string) => {
    triggerHaptic('light');
    setActiveCollectionFilterId(colId);
    setView(AppView.ALL);
    if (window.innerWidth < 768) onCloseMobile();
  };

  return (
    <div className="sidebar-label-fade flex flex-col h-full">
      <div className="mt-10 mb-3 px-6 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-on-surface-variant">Folders</span>
        <button
          onClick={() => setShowCollectionManagementModal(true)}
          className="p-1.5 hover:bg-on-surface/5 hover:text-primary transition-all rounded-lg opacity-20 hover:opacity-100 interactive text-on-surface"
          aria-label="Manage Folders"
        >
          <Settings2 size={12} className="icon-tactical" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {collections.length === 0 ? (
          <div className="px-6 py-4 opacity-20">
            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed font-serif">Setup folders to organize notes.</p>
          </div>
        ) : (
          collections.map((col) => {
            const isActive = activeCollectionFilterId === col.id;
            return (
              <button
                key={col.id}
                onClick={() => handleCollectionClick(col.id)}
                className={`
                  w-full flex items-center h-12 md:h-10 px-4 rounded-xl transition-all group interactive
                  ${isActive ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/[0.04]'}
                `}
              >
                <Folder size={14} className={`shrink-0 ${isActive ? 'text-on-primary' : 'opacity-40'} icon-tactical`} />
                <span className="ml-3 text-[12px] md:text-[11px] font-bold uppercase tracking-widest truncate">
                  {col.name}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
