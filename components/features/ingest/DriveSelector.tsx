
import React, { useEffect, useState } from 'react';
import { FileText, Music, File as FileIcon, Clock, ChevronRight, Loader2, CloudOff, Globe, Lock, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { signInWithGoogle } from '../../../services/supabaseClient';
import { DriveFile } from '../../../store/types';
import { triggerHaptic } from '../../../services/hapticService';

interface DriveSelectorProps {
  onSelect: (files: DriveFile[]) => void;
  disabled: boolean;
}

export const DriveSelector: React.FC<DriveSelectorProps> = ({ onSelect, disabled }) => {
  const { driveFiles, isDriveLoading, fetchDriveFiles, session, addToast } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const isGoogleUser = session?.user?.app_metadata?.provider === 'google';
  const providerToken = (session as any)?.provider_token;

  useEffect(() => {
    if (isGoogleUser) {
      fetchDriveFiles();
    }
  }, [fetchDriveFiles, isGoogleUser]);

  const handleLink = async () => {
    try {
      triggerHaptic('medium');
      await signInWithGoogle();
    } catch (e: any) {
      addToast("Workspace link failed.", "error");
    }
  };

  const toggleFile = (id: string) => {
    triggerHaptic('light');
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleImport = () => {
    triggerHaptic('medium');
    const selectedFiles = driveFiles.filter(f => selectedIds.has(f.id));
    if (selectedFiles.length > 0) {
      onSelect(selectedFiles);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document')) return <FileText size={18} className="text-primary shrink-0" />;
    if (mimeType.includes('audio') || mimeType.includes('mpeg')) return <Music size={18} className="text-primary shrink-0" />;
    if (mimeType.includes('pdf')) return <FileIcon size={18} className="text-error shrink-0" />;
    return <FileIcon size={18} className="text-on-surface-variant/40 shrink-0" />;
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (isDriveLoading && driveFiles.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-40 animate-fade-in">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Drive</p>
      </div>
    );
  }

  if (!providerToken && driveFiles.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-6 text-center px-8 animate-fade-in">
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary/40 border border-outline-variant/10">
          <Lock size={32} />
        </div>
        <div className="space-y-2 max-w-[240px]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Reconnect Required</p>
          <p className="text-[9px] font-bold text-on-surface-variant opacity-60 leading-relaxed">Google requires a fresh connection to access your drive files.</p>
        </div>
        <button 
          onClick={handleLink}
          className="px-8 py-3 bg-primary text-on-primary rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Globe size={12} strokeWidth={3} className="shrink-0" /> Reconnect
        </button>
      </div>
    );
  }

  if (driveFiles.length === 0 && !isDriveLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-6 opacity-40 text-center px-8">
        <CloudOff size={48} className="text-on-surface-variant/20" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">No recent files found</p>
          <p className="text-[9px] font-bold max-w-[200px]">No research files were found in your recent activity.</p>
        </div>
        <button onClick={() => { triggerHaptic('light'); fetchDriveFiles(); }} className="text-[9px] font-black text-primary uppercase tracking-widest">Retry Scan</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
      <div className="flex items-center justify-between px-2 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">Recent Workspace Files</span>
          {selectedIds.size > 0 && (
            <span className="text-[8px] font-black bg-primary text-on-primary px-2 py-0.5 rounded-full animate-scale-in">
              {selectedIds.size} SELECTED
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 min-h-0 pr-1">
        {driveFiles.map(file => {
          const isSelected = selectedIds.has(file.id);
          return (
            <button
              key={file.id}
              disabled={disabled}
              onClick={() => toggleFile(file.id)}
              className={`w-full flex items-center gap-4 p-4 border rounded-2xl transition-all group text-left active:scale-[0.99] ${isSelected ? 'bg-primary/5 border-primary/30 shadow-inner' : 'bg-surface-container/50 border-outline-variant/5 hover:bg-surface-container-high hover:border-primary/20'}`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-on-surface-variant/20 group-hover:border-primary/40'}`}>
                {isSelected && <Check size={12} strokeWidth={4} className="text-white shrink-0" />}
              </div>
              
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {getFileIcon(file.mimeType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-on-surface truncate leading-tight mb-1">{file.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Clock size={8} className="shrink-0" /> {formatTime(file.modifiedTime)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 mt-auto shrink-0">
        <button 
          onClick={handleImport}
          disabled={selectedIds.size === 0 || disabled}
          className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-20 disabled:grayscale transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {disabled ? <Loader2 size={16} className="animate-spin shrink-0" /> : <ChevronRight size={16} strokeWidth={3} className="shrink-0" />}
          {selectedIds.size > 1 ? `Import ${selectedIds.size} Documents` : 'Import Selected'}
        </button>
      </div>
    </div>
  );
};
