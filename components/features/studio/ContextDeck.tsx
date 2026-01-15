import React, { useState, useRef } from 'react';
import { Paperclip, Link as LinkIcon, FileText, Sparkles, X, Plus, Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { ingestContent } from '../../../services/ingestionService';
import { ContentType } from '../../../types';

export const ContextDeck: React.FC = () => {
  const { contextAttachments, addContextAttachment, removeContextAttachment, insights, addToast } = useAppStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInsightPicker, setShowInsightPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddLink = async () => {
    if (!urlInput.trim()) return;
    setIsLoading(true);
    try {
        const result = await ingestContent(urlInput, ContentType.URL);
        addContextAttachment({
            id: uuidv4(),
            type: 'LINK',
            title: result.title || urlInput,
            content: result.processed_text,
            metadata: { url: urlInput }
        });
        setUrlInput('');
        setIsAdding(false);
        addToast("Reference link added.", "success");
    } catch (e) {
        addToast("Could not load link.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024 * 2) { 
        addToast("File too large (Limit: 2MB)", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
        const text = ev.target?.result as string;
        if (text) {
            addContextAttachment({
                id: uuidv4(),
                type: 'FILE',
                title: file.name,
                content: text
            });
            addToast("File reference attached.", "success");
        }
    };
    reader.readAsText(file);
    setIsAdding(false);
  };

  const handleInsightSelect = (insight: any) => {
      const content = `Title: ${insight.title}\nSummary: ${insight.summary}\nNext Steps: ${insight.action_items.join(', ')}`;
      addContextAttachment({
          id: uuidv4(),
          type: 'INSIGHT',
          title: `Ref: ${insight.title}`,
          content: content,
          metadata: { originalId: insight.id }
      });
      setShowInsightPicker(false);
      setIsAdding(false);
      addToast("Previous insight connected.", "success");
  };

  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
             <Paperclip size={12} className="text-primary shrink-0" />
             <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">References</h3>
          </div>
          <span className="text-[8px] font-bold text-on-surface-variant/30 uppercase tracking-widest">{contextAttachments.length} items</span>
       </div>

       <div className="flex flex-col gap-2">
          {contextAttachments.map(att => (
             <div key={att.id} className="flex items-center justify-between p-2.5 bg-surface-container rounded-xl border border-outline-variant/10 group animate-scale-in">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                      {att.type === 'LINK' && <LinkIcon size={12} />}
                      {att.type === 'FILE' && <FileText size={12} />}
                      {att.type === 'INSIGHT' && <Sparkles size={12} />}
                   </div>
                   <span className="text-[10px] font-bold text-on-surface truncate">{att.title}</span>
                </div>
                <button onClick={() => removeContextAttachment(att.id)} className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-error transition-colors shrink-0">
                   <X size={12} />
                </button>
             </div>
          ))}

          {isAdding ? (
             <div className="p-3 bg-surface-container-highest rounded-xl animate-fade-in space-y-3 border border-outline-variant/20 shadow-lg">
                {!showInsightPicker ? (
                    <>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Paste link here..." 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                            className="w-full bg-background border border-outline-variant/10 rounded-lg px-2 py-2 text-[11px] font-bold outline-none focus:border-primary/30"
                        />
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleAddLink} 
                                disabled={!urlInput || isLoading}
                                className="w-full py-2 bg-primary text-on-primary rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                            >
                                {isLoading ? <Loader2 size={12} className="animate-spin shrink-0" /> : 'Add Link'}
                            </button>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 py-2 bg-surface-container-low border border-outline-variant/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
                                >
                                    Add Text
                                </button>
                                <button 
                                    onClick={() => setShowInsightPicker(true)}
                                    className="flex-1 py-2 bg-surface-container-low border border-outline-variant/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary"
                                >
                                    Link Note
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.json" onChange={handleFileSelect} />
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface opacity-60">Select Research Point</span>
                            <button onClick={() => setShowInsightPicker(false)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Cancel</button>
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 p-1 bg-background/50 rounded-lg">
                            {insights.length === 0 ? (
                                <p className="text-[10px] text-center py-4 opacity-40 italic">No previous insights.</p>
                            ) : insights.slice(0, 15).map(i => (
                                <button 
                                    key={i.id} 
                                    onClick={() => handleInsightSelect(i)}
                                    className="text-left px-3 py-2.5 rounded-lg hover:bg-primary/10 text-xs font-bold text-on-surface truncate border border-transparent hover:border-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {i.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {!showInsightPicker && (
                    <button onClick={() => { setIsAdding(false); setShowInsightPicker(false); }} className="w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 hover:opacity-100 py-1">Dismiss</button>
                )}
             </div>
          ) : (
             <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-3 rounded-xl border border-dashed border-outline-variant/20 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
             >
                <Plus size={14} className="shrink-0" /> Add Reference
             </button>
          )}
       </div>
    </div>
  );
};