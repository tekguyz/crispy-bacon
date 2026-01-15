
import React, { useEffect } from 'react';
import { Trash2, HardDrive, ZapOff } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const DataManagementSection: React.FC = () => {
  const { 
    openConfirmation, storageUsage, updateStorageUsage, clearLocalCache 
  } = useAppStore();
  
  useEffect(() => {
    updateStorageUsage();
  }, [updateStorageUsage]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClearData = () => {
    openConfirmation({
      title: 'Reset Application?',
      message: 'This will delete your local history and sign you out. Your permanent notes are safe.',
      variant: 'danger',
      confirmLabel: 'Reset',
      onConfirm: () => { localStorage.clear(); window.location.reload(); }
    });
  };

  const handleClearCacheOnly = () => {
    openConfirmation({
      title: 'Cleanup Workspace?',
      message: 'This removes temporary files and resets your local memory.',
      variant: 'neutral',
      confirmLabel: 'Cleanup',
      onConfirm: async () => { await clearLocalCache(); }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <HardDrive size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Vault Size</span>
            </div>
            <span className="text-xs font-mono font-black text-on-surface">{formatSize(storageUsage)}</span>
        </div>
        
        <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-relaxed">
          Bacon manages your storage automatically. Use cleanup if the app feels heavy.
        </p>
        
        <button 
          onClick={handleClearCacheOnly}
          className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-high border border-outline-variant/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all active:scale-[0.98]"
        >
          <Trash2 size={12} /> Tidy Cache
        </button>
      </div>

      <div className="bg-error/5 border border-error/10 rounded-[2rem] p-6 space-y-4 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] font-bold text-error/60 leading-relaxed">
          This removes everything. Use this only as a final troubleshooting step.
        </p>

        <button 
          onClick={handleClearData}
          className="w-full flex items-center justify-center gap-2 h-12 bg-surface-container-high border border-error/20 text-error rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-error hover:text-on-error transition-all active:scale-[0.98]"
        >
          <ZapOff size={14} /> Reset Library
        </button>
      </div>
    </div>
  );
};
