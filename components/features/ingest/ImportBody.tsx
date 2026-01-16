import React, { useRef } from 'react';
import { ArrowRight, Cloud, Link as LinkIcon, Upload, FileText, Target, Sparkles, ChevronDown, Crown } from 'lucide-react';
import { DriveSelector } from './DriveSelector';
import { InsightTemplate } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

export const ImportBody: React.FC<any> = ({ 
  showDrive, setShowDrive, isPro, isProcessing, urlValue, setUrlValue, 
  inputValue, setInputValue, selectedTemplate, setSelectedTemplate, 
  handleDriveSelect, fileDropProps 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentIntent, setCurrentIntent, setShowUpgradeModal } = useAppStore();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  if (showDrive) {
    return (
      <div className="flex-1 flex flex-col p-6 animate-fade-in overflow-hidden">
        <button onClick={() => setShowDrive(false)} className="mb-4 flex items-center gap-2 text-[8px] font-mono font-black uppercase tracking-widest text-primary hover:underline focus:outline-none shrink-0">
          <ArrowRight size={10} className="rotate-180 shrink-0" /> Back
        </button>
        {isPro ? (
          <DriveSelector onSelect={handleDriveSelect} disabled={isProcessing} />
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary/40 border border-outline-variant/10 shadow-inner"><Cloud size={24} className="shrink-0" /></div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-base font-black font-display italic uppercase">Executive Access</h3>
              <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-relaxed">Cloud import is reserved for Pro members.</p>
            </div>
            <button onClick={() => setShowUpgradeModal(true)} className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              <Crown size={12} fill="currentColor" className="shrink-0" /> Upgrade Access
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2.5">
             <div className="flex items-center gap-2 px-1">
                <LinkIcon size={12} className="text-primary opacity-40 shrink-0" />
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant/60">Web Link</label>
             </div>
             <div className={`bg-card border border-outline-variant/10 rounded-xl p-1 flex items-center shadow-inner transition-all ${urlValue ? 'ring-2 ring-primary/20 border-primary/30' : 'focus-within:border-primary/40'}`}>
                <input type="url" className="flex-1 bg-transparent text-on-surface px-3 py-2 text-xs font-bold placeholder:text-on-surface-variant/40 focus:outline-none" placeholder="Paste URL..." value={urlValue} onChange={(e) => setUrlValue(e.target.value)} />
             </div>
          </div>

          <div className="space-y-2.5">
             <div className="flex items-center gap-2 px-1">
                <Upload size={12} className="text-primary opacity-40 shrink-0" />
                <h3 className="text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant/60">Add Files</h3>
             </div>
             <div onDragOver={fileDropProps.handleDragOver} onDragLeave={fileDropProps.handleDragLeave} onDrop={fileDropProps.handleDrop} onClick={() => fileInputRef.current?.click()} className={`h-11 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group ${fileDropProps.isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-low'} ${fileDropProps.selectedFiles.length > 0 ? 'border-primary/40 bg-primary/5' : ''}`}>
                {/* Fix: Moved invalid Tailwind class props to the className attribute to comply with React's InputHTMLAttributes and fix TypeScript errors. */}
                <input type="file" ref={fileInputRef} onChange={fileDropProps.handleFileSelect} multiple accept="audio/*,.mp3,.wav,.m4a,.webm,text/plain,.md,.txt,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="opacity-0 absolute inset-0 cursor-pointer hidden" />
                {fileDropProps.selectedFiles.length > 0 ? (
                  <div className="flex items-center gap-2 animate-scale-in">
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">{fileDropProps.selectedFiles.length} item(s)</span>
                      <button onClick={(e) => { e.stopPropagation(); fileDropProps.setSelectedFiles([]); }} className="text-[7px] font-black uppercase text-error hover:underline">X</button>
                  </div>
                ) : <span className="text-[8px] font-mono font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Drop Audio or Text</span>}
             </div>
             <button onClick={() => setShowDrive(true)} className="w-full py-1.5 bg-surface-container-high border border-outline-variant/5 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5 focus:outline-none">
              <Cloud size={10} className="shrink-0" /> Cloud Files
             </button>
          </div>
      </div>

      <div className="h-px bg-outline-variant/5 w-full" />

      <div className="space-y-2.5">
          <div className="flex items-center gap-2 px-1">
             <FileText size={12} className="text-primary opacity-40 shrink-0" />
             <label className="text-[9px] font-mono font-black uppercase tracking-widest text-on-surface-variant/60">Notes</label>
          </div>
          <div className={`bg-card border border-outline-variant/10 rounded-2xl p-4 shadow-inner transition-all ${inputValue ? 'ring-2 ring-primary/10 border-primary/20' : 'focus-within:ring-2 focus-within:ring-primary/10'}`}>
              <textarea disabled={isProcessing} className="w-full min-h-[100px] bg-transparent text-on-surface resize-none focus:outline-none text-sm font-bold placeholder:text-on-surface-variant/40 leading-relaxed font-serif" placeholder="Paste or type context here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </div>
      </div>

      <div className="pt-2 border-t border-outline-variant/10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 px-1">
                  <Target size={12} className="text-primary shrink-0" />
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-on-surface">Template</label>
              </div>
              <div className="relative group">
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value as any)} className="w-full bg-card border-2 border-outline-variant/10 rounded-xl pl-4 pr-10 py-2.5 text-[9px] font-black uppercase tracking-widest text-on-surface focus:outline-none cursor-pointer hover:border-primary/40 transition-colors appearance-none shadow-sm">
                      {Object.values(InsightTemplate).map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant opacity-40"><ChevronDown size={12} strokeWidth={3} /></div>
              </div>
          </div>
          
          <div className="flex-1 space-y-2">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full px-1 focus:outline-none">
                  <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-primary shrink-0" />
                      <h3 className="text-[9px] font-mono font-black uppercase tracking-widest text-on-surface">Instructions</h3>
                  </div>
                  <ChevronDown size={10} className={`transition-transform duration-300 shrink-0 ${showAdvanced ? 'rotate-180 text-primary' : 'text-on-surface-variant/40'}`} />
              </button>
              {showAdvanced && (
                <div className="animate-slide-up">
                    <textarea value={currentIntent} onChange={(e) => setCurrentIntent(e.target.value)} disabled={!isPro} placeholder={isPro ? "Tell the assistant what to find..." : "Pro required."} className={`w-full min-h-[60px] bg-card border border-outline-variant/10 rounded-xl p-3 text-[10px] font-bold text-on-surface leading-relaxed resize-none focus:outline-none shadow-inner ${!isPro ? 'opacity-40 grayscale cursor-not-allowed' : 'focus:border-primary/40'}`} />
                </div>
              )}
          </div>
      </div>
    </div>
  );
};