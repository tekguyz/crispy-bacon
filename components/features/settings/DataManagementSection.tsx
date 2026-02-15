
import React, { useEffect } from 'react';
import { Trash2, HardDrive, ZapOff, FileText, Download, ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const DataManagementSection: React.FC = () => {
  const { 
    openConfirmation, storageUsage, updateStorageUsage, clearLocalCache,
    defaultExportFormat, setDefaultExportFormat
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
      title: 'Reset App?',
      message: 'This will delete local history and sign you out. Cloud notes are safe.',
      variant: 'danger',
      confirmLabel: 'Reset',
      onConfirm: () => { localStorage.clear(); window.location.reload(); }
    });
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="divide-y divide-outline-variant/5">
        
        {/* ROW 1: EXPORT */}
        <div className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Download size={18} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Export Format</span>
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Default Output</span>
               </div>
            </div>
            <div className="relative">
                <select 
                  value={defaultExportFormat}
                  onChange={(e) => setDefaultExportFormat(e.target.value as any)}
                  className="bg-surface-container-high border border-outline-variant/10 rounded-xl pl-4 pr-8 py-2 text-[9px] font-black text-on-surface uppercase tracking-widest outline-none focus:border-primary/30 appearance-none cursor-pointer hover:bg-surface-container-highest transition-all min-w-[100px]"
                >
                  <option value="markdown">Markdown</option>
                  <option value="text">Plain Text</option>
                  <option value="json">JSON</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
        </div>

        {/* ROW 2: STORAGE */}
        <div className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <HardDrive size={18} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">On Device</span>
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{formatSize(storageUsage)} used</span>
               </div>
            </div>
            <button 
                onClick={clearLocalCache}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-on-surface transition-all active:scale-95"
            >
                Clear
            </button>
        </div>

        {/* ROW 3: DANGER ZONE */}
        <div className="p-5 flex items-center justify-between bg-error/5 group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-error opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZapOff size={18} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-error">Reset App</span>
                  <span className="text-[8px] font-bold text-error opacity-60 uppercase tracking-widest">Sign out & clear data</span>
               </div>
            </div>
            <button 
                onClick={handleClearData}
                className="px-4 py-2 bg-background border border-error/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-error hover:bg-error hover:text-white transition-all active:scale-95"
            >
                Reset App
            </button>
        </div>

      </div>
    </div>
  );
};
