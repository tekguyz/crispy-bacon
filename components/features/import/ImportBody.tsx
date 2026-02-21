
import React from 'react';
import { Upload, Link, FileText, HardDrive } from 'lucide-react';
import { InsightTemplate } from '../../../types';
import { triggerHaptic } from '../../../services/hapticService';

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

  return (
    <div className="p-6 space-y-8">
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
        />
      </div>

      {/* Drive Integration (Pro) */}
      {isPro && (
        <div className="pt-4 border-t border-outline-variant/10">
          <button
            onClick={() => { triggerHaptic('light'); setShowDrive(!showDrive); }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 hover:text-primary transition-colors"
          >
            <HardDrive size={14} />
            <span>Google Drive</span>
          </button>
          
          {showDrive && (
            <div className="mt-4 p-4 bg-surface-container-highest rounded-xl">
              <p className="text-xs text-center text-on-surface-variant">Drive integration coming soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
