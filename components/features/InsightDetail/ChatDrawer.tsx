
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Send, Loader2, MessageSquare, ChevronRight, Activity, Sparkles, Zap, ArrowRight, ShieldCheck, FileText, AlignLeft } from 'lucide-react';
import { InsightContent, ProcessingStatus, ContentType } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { BaconLogo } from '../../ui/Logo';

interface ChatDrawerProps {
  insight: InsightContent;
  isFailed: boolean;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ insight, isFailed }) => {
  const { chatHistory, isChatLoading, sendChatMessage } = useAppStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isSummarizing = insight.processing_status === ProcessingStatus.PROCESSING || insight.processing_status === ProcessingStatus.PENDING;

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  // INTELLIGENCE METRICS: Determine the actual depth of context available
  const contextStats = useMemo(() => {
    const raw = insight.original_content || '';
    const processed = typeof insight.processed_text === 'string' ? insight.processed_text : JSON.stringify(insight.processed_text || '');
    const summary = insight.summary || '';

    // Find the heaviest data source
    let wordCount = 0;
    let label = 'Summary Context';
    let icon = AlignLeft;

    const rawCount = raw.trim().split(/\s+/).length;
    const processedCount = processed.trim().split(/\s+/).length;
    const summaryCount = summary.trim().split(/\s+/).length;

    // Logic: If raw content is significantly larger, use it. Otherwise fall back to processed.
    if (rawCount > 50 && rawCount >= processedCount) {
        wordCount = rawCount;
        label = insight.type === ContentType.MEETING ? 'Full Audio Transcript' : 'Raw Source Content';
        icon = FileText;
    } else if (processedCount > summaryCount) {
        wordCount = processedCount;
        label = 'Deep Analysis Layer';
        icon = Activity;
    } else {
        wordCount = summaryCount;
        label = 'Executive Summary';
        icon = AlignLeft;
    }

    // TRUST PROTOCOL: Only show numbers if they look impressive (>100 words).
    // Otherwise, just confirm the source exists.
    const showCount = wordCount > 100;

    return { wordCount, label, icon, showCount };
  }, [insight]);

  const handleSendMessage = async (e?: React.FormEvent, manualMsg?: string) => {
    if (e) e.preventDefault();
    const msg = manualMsg || chatInput;
    if (!msg.trim() || isChatLoading || isSummarizing) return;
    
    triggerHaptic('light');
    setChatInput('');
    await sendChatMessage(msg, insight);
  };

  const suggestions = [
    { label: "Summarize friction", icon: Activity, query: "Summarize the core friction points and risks mentioned." },
    { label: "Find decisions", icon: Zap, query: "List all hard decisions made and who owns them." },
    { label: "Next steps", icon: ChevronRight, query: "Synthesize a checklist of next steps." },
    { label: "Key Metrics", icon: Sparkles, query: "Identify any key metrics, dates, or numbers discussed." }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between shrink-0 bg-surface-container-low z-10">
         <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shadow-inner">
                <MessageSquare size={14} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface leading-none">Assistant</span>
              <span className="text-[7px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-0.5">Context Active</span>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-0">
        
        {/* ZERO STATE: Context Dashboard */}
        {chatHistory.length === 0 && !isSummarizing && (
           <div className="flex flex-col items-center justify-center min-h-full py-8 animate-fade-in space-y-8">
              
              <div className="text-center space-y-4 max-w-xs mx-auto">
                 <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                    <BaconLogo className="w-8 h-8 relative z-10 text-on-surface" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-on-surface">Ready to Interrogate</h3>
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant/10 rounded-lg">
                        <contextStats.icon size={10} className="text-primary" />
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {contextStats.showCount ? (
                            <>Scanning <span className="text-on-surface">{contextStats.wordCount.toLocaleString()} words</span> from {contextStats.label}</>
                          ) : (
                            <>Context Active: <span className="text-on-surface">{contextStats.label}</span></>
                          )}
                        </p>
                    </div>
                 </div>
              </div>

              {/* Tactical Suggestions Grid */}
              <div className="w-full max-w-sm grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                 {suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(undefined, s.query)}
                      className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container hover:border-primary/20 hover:shadow-lg transition-all group text-left active:scale-[0.98]"
                    >
                       <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          <s.icon size={16} strokeWidth={2.5} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">
                          {s.label}
                       </span>
                    </button>
                 ))}
              </div>

              <div className="flex items-center gap-2 opacity-30">
                 <ShieldCheck size={10} />
                 <span className="text-[8px] font-mono font-black uppercase tracking-widest">Grounded in Fact</span>
              </div>
           </div>
        )}

        {/* Chat History */}
        <div className="space-y-6 pb-4">
          {chatHistory.map((msg, i) => (
            <ChatMessageBubble key={i} message={msg} />
          ))}
          
          {isChatLoading && (
            <div className="flex justify-start animate-fade-in pl-2">
              <div className="bg-surface-container-high px-4 py-3 rounded-2xl flex items-center gap-2 border border-outline-variant/10 shadow-sm">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-2" />
        </div>
      </div>
      
      {/* Input Footer */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 z-10 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center group">
            <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask a follow-up question..."
                disabled={isChatLoading || isSummarizing}
                className="w-full bg-surface-container-high/50 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl pl-5 pr-14 py-4 text-sm font-bold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 font-sans"
            />
            <button 
                type="submit"
                disabled={!chatInput.trim() || isChatLoading || isSummarizing}
                className="absolute right-2 w-10 h-10 bg-on-surface text-surface rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-0 disabled:scale-75"
            >
                {isChatLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={3} />}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
