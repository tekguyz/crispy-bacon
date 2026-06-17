import React, { useState } from 'react';
import { 
  Upload, Link, FileText, HardDrive, Lock, Cloud, 
  Loader2, AlertCircle, Search, RefreshCw, Music, 
  CheckSquare, Square 
} from 'lucide-react';
import { InsightTemplate } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';
import { useAppStore } from '../../../store/useAppStore';
import { useDriveFilesQuery } from '../../../hooks/useQueries';

interface ImportBodyProps {
  showDrive: boolean;
  setShowDrive: (show: boolean) => void;
  isPro: boolean;
  isAnalyzing: boolean;
  urlValue: string;
  setUrlValue: (val: string) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  selectedTemplate: InsightTemplate;
  setSelectedTemplate: (val: InsightTemplate) => void;
  handleDriveSelect: (files: any[]) => void;
  fileDropProps: {
    isDragging: boolean;
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export const ImportBody: React.FC<ImportBodyProps> = ({
  showDrive, setShowDrive, isPro, isAnalyzing,
  urlValue, setUrlValue, inputValue, setInputValue,
  selectedTemplate, setSelectedTemplate, handleDriveSelect,
  fileDropProps
}) => {
  const { isDragging, selectedFiles, handleDragOver, handleDragLeave, handleDrop, handleFileSelect } = fileDropProps;
  
  // Tab handling: 'local' represents files / texts / links, 'drive' represents Google Drive files
  const [activeTab, setActiveTab] = useState<'local' | 'drive'>('local');
  const [googleSearchQuery, setGoogleSearchQuery] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const handleTabChange = (tab: 'local' | 'drive') => {
    triggerHaptic('light');
    setActiveTab(tab);
    setShowDrive(tab === 'drive');
  };

  // Retrieve store utilities like upgrade triggers and Supabase session elements
  const { session, setShowUpgradeModal, addToast } = useAppStore();
  const isGoogleLinked = session?.user?.app_metadata?.provider === 'google';
  const hasProviderToken = !!(session as any)?.provider_token;

  // React Query hook for pulling Google Drive files
  const { 
    data: driveFiles, 
    isLoading: isDriveLoading, 
    isError: isDriveError, 
    error: driveError,
    refetch: refetchDrive 
  } = useDriveFilesQuery();

  // Helper formats
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.document') {
      return <FileText size={16} className="text-blue-500" />;
    }
    if (mimeType.startsWith('audio/')) {
      return <Music size={16} className="text-emerald-500" />;
    }
    return <FileText size={16} className="text-on-surface-variant/70" />;
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Google Link action helper
  const handleLinkGoogle = async () => {
    try {
      const { signInWithGoogle } = await import('../../../services/supabaseClient');
      addToast("Connecting to Google...", "info");
      await signInWithGoogle();
    } catch (e: any) {
      addToast("Connection failed.", "error");
    }
  };

  const handleToggleFileId = (id: string) => {
    triggerHaptic('light');
    setSelectedFileIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExecuteImport = () => {
    const selectedFilesObj = (driveFiles || []).filter((f: any) => selectedFileIds.includes(f.id));
    if (selectedFilesObj.length > 0) {
      triggerHaptic('medium');
      handleDriveSelect(selectedFilesObj);
      setSelectedFileIds([]);
    }
  };

  // Filter Drive Files by search query
  const filteredDriveFiles = (driveFiles || []).filter((f: any) => 
    f.name.toLowerCase().includes(googleSearchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      
      {/* Navigation Tabs - Putting Google Drive Prominently at the Top! */}
      <div className="flex bg-surface-container-high p-1 rounded-2xl border border-outline-variant/10">
        <button
          onClick={() => handleTabChange('local')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'local' ? 'bg-background text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <Upload size={14} />
          <span>Local Files & Text</span>
        </button>
        <button
          onClick={() => handleTabChange('drive')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'drive' ? 'bg-background text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <HardDrive size={14} />
          <span>Google Drive</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'local' ? (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
              id="local-file-uploader"
            />
            
            <div className="flex flex-col items-center justify-center text-center gap-4 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                <Upload size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface mb-1">Drop files here</h3>
                <p className="text-xs text-on-surface-variant">PDF, DOCX, TXT, MD, Audio</p>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">
              <Link size={14} />
              <span>Import from URL</span>
            </div>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://..."
              className="w-full h-12 px-4 bg-surface-container-highest rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isAnalyzing}
              id="import-url-input"
            />
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">
              <FileText size={14} />
              <span>Paste Text</span>
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste meeting notes, articles, or thoughts..."
              className="w-full h-32 p-4 bg-surface-container-highest rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              disabled={isAnalyzing}
              id="import-pasted-text"
            />
          </div>
        </div>
      ) : (
        // GOOGLE DRIVE TAB CONTENT
        <div className="space-y-4">
          
          {/* SCENARIO 1: Non-Pro users are locked */}
          {!isPro ? (
            <div className="p-8 flex flex-col items-center text-center gap-6 bg-surface-container-low border border-outline-variant/10 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Lock size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-on-surface uppercase tracking-wider">Executive Cloud Bridge</h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Connect Google Drive to import files, audio briefings, and Google Docs directly. Access deep reasoning models and templates.
                </p>
              </div>
              <button
                onClick={() => { triggerHaptic('medium'); setShowUpgradeModal(true); }}
                className="h-11 px-6 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                id="drive-premium-upgrade-btn"
              >
                Upgrade to Executive
              </button>
            </div>
          ) : 

          /* SCENARIO 2: Pro but Google is not linked */
          (!isGoogleLinked || !hasProviderToken) ? (
            <div className="p-8 flex flex-col items-center text-center gap-6 bg-surface-container-low border border-outline-variant/10 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <HardDrive size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-on-surface uppercase tracking-wider">Connect Google Drive</h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Please authorize Crispy Bacon to connect with your Google Drive files, text summaries, and voice logs safely.
                </p>
              </div>
              <button
                onClick={handleLinkGoogle}
                className="h-11 px-6 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                id="drive-authorize-connection-btn"
              >
                <Cloud size={14} strokeWidth={3} />
                <span>Connect Account</span>
              </button>
            </div>
          ) :

          /* SCENARIO 3: Loading drive catalog */
          isDriveLoading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-on-surface-variant">Scanning cloud drive catalog...</p>
            </div>
          ) :

          /* SCENARIO 4: Loading failed / error */
          isDriveError ? (
            <div className="p-8 flex flex-col items-center text-center gap-4 bg-error/5 border border-error/10 rounded-2xl">
              <AlertCircle className="w-10 h-10 text-error" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-error">Drive Scan Failed</p>
                <p className="text-[10px] text-on-surface-variant">
                  We couldn't reach Google. Your session token may have expired.
                </p>
              </div>
              <button
                onClick={() => refetchDrive()}
                className="h-9 px-4 bg-surface-container-highest border border-outline-variant/10 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-surface-container-highest/80 transition-colors"
                id="drive-retry-sync-btn"
              >
                Retry Connection
              </button>
            </div>
          ) :

          /* SCENARIO 5: No files */
          filteredDriveFiles.length === 0 && googleSearchQuery.length === 0 ? (
            <div className="p-8 flex flex-col items-center text-center gap-3">
              <HardDrive className="w-12 h-12 text-on-surface-variant/40" />
              <p className="text-xs text-on-surface-variant font-bold">No eligible files found.</p>
              <p className="text-[10px] text-on-surface-variant max-w-xs">
                Upload Google Docs (.gdoc) or audio recordings (.mp3, .wav, .m4a) to your Google Drive to pull them here.
              </p>
              <button
                onClick={() => refetchDrive()}
                className="mt-2 h-9 px-4 bg-surface-container-high rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-surface-container-highest transition-colors flex items-center gap-1.5"
                id="drive-refresh-empty-btn"
              >
                <RefreshCw size={10} />
                <span>Sync / Refresh</span>
              </button>
            </div>
          ) : (

          /* SCENARIO 6: Full file list with search filter */
          <div className="space-y-4">
            {/* Search and Refresh Controls */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/60" />
                <input
                  type="text"
                  value={googleSearchQuery}
                  onChange={(e) => setGoogleSearchQuery(e.target.value)}
                  placeholder="Search drive files..."
                  className="w-full h-10 pl-9 pr-4 bg-surface-container-highest rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-high"
                  id="drive-search-input"
                />
              </div>
              <button
                onClick={() => { triggerHaptic('light'); refetchDrive(); }}
                className="w-10 h-10 bg-surface-container-highest rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10"
                title="Refresh Files"
                id="drive-refresh-btn"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* List wrapper */}
            {filteredDriveFiles.length === 0 ? (
              <p className="text-xs text-center text-on-surface-variant py-8">No results found for search.</p>
            ) : (
              <div className="border border-outline-variant/15 rounded-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar divide-y divide-outline-variant/10 bg-surface-container-low" id="drive-files-container">
                {filteredDriveFiles.map((file: any) => {
                  const isSelected = selectedFileIds.includes(file.id);
                  return (
                    <div
                      key={file.id}
                      onClick={() => handleToggleFileId(file.id)}
                      className={`flex items-center gap-3 p-3 text-left transition-all cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-high'}`}
                      id={`drive-file-${file.id}`}
                    >
                      <div className="text-primary shrink-0">
                        {isSelected ? <CheckSquare size={16} strokeWidth={2.5} /> : <Square size={16} className="opacity-40" />}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-on-surface truncate">{file.name}</p>
                        <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                          {file.size ? formatBytes(parseInt(file.size)) : 'Google Doc'} • {new Date(file.modifiedTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Import selected trigger details */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/60">
                {selectedFileIds.length} file{selectedFileIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                disabled={selectedFileIds.length === 0}
                onClick={handleExecuteImport}
                className={`h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] ${selectedFileIds.length > 0 ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110' : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'}`}
                id="drive-import-action-btn"
              >
                Import Selected
              </button>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};
