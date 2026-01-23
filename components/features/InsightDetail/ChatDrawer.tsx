
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Send, Loader2, MessageSquare, ChevronRight, Activity, Sparkles, Zap, ArrowRight, ShieldCheck, FileText, AlignLeft, Bot } from 'lucide-react';
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

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading]);

  const contextStats = useMemo(() => {
    const raw = insight.original_content || '';
    const processed = typeof insight.processed_text === 'string' ? insight.processed_text : JSON.stringify(insight.processed_text || '');
    const summary = insight.summary || '';

    let wordCount = 0;
    let label = 'Summary';
    let icon = AlignLeft;

    const rawCount = raw.trim().split(/\s+/).length;
    const processedCount = processed.trim().split(/\s+/).length;
    const summaryCount = summary.trim().split(/\s+/).length;

    if (rawCount > 50 && rawCount >= processedCount) {
        wordCount = rawCount;
        label = 'Raw Source';
        icon = FileText;
    } else if (processedCount > summaryCount) {
        wordCount = processedCount;
        label = 'Transcript';
        icon = Activity;
    } else {
        wordCount = summaryCount;
        label = 'Brief';
        icon = AlignLeft;
    }

    return { wordCount, label, icon };
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
    { label: "Find Friction", icon: Activity, query: "Summarize the core friction points and risks mentioned." },
    { label: "List Decisions", icon: Zap, query: "List all hard decisions made and who owns them." },
    { label: "Action Items", icon: ChevronRight, query: "Synthesize a checklist of next steps." },
    { label: "Key Metrics", icon: Sparkles, query: "Identify any key metrics, dates, or numbers discussed." }
  ];

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />

      {/* Header - Ultra Compact */}
      <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md z-10 h-14">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface-container-high text-primary rounded-lg flex items-center justify-center border border-outline-variant/10 shadow-inner">
                <Bot size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface leading-none">Assistant</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSummarizing ? 'bg-primary animate-pulse' : 'bg-success'}`} />
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">
                    {isSummarizing ? 'Processing' : 'Active'}
                  </span>
              </div>
            </div>
         </div>
         
         <div className="flex items-center gap-2 px-2 py-1 bg-surface-container-high rounded-md border border-outline-variant/10">
            <contextStats.icon size={10} className="text-on-surface-variant" />
            <span className="text-[8px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                {contextStats.wordCount > 0 ? `${(contextStats.wordCount / 1000).toFixed(1)}k Words` : 'Ready'}
            </span>
         </div>
      </div>

      {/* Chat Area - No Scrollbar */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 relative z-0 flex flex-col">
        
        {/* Empty State: Bottom-Anchored Suggestions */}
        {chatHistory.length === 0 && !isSummarizing && (
           <div className="mt-auto pb-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-4 opacity-40 px-1">
                 <BaconLogo className="w-4 h-4" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Quick Prompts</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                 {suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(undefined, s.query)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container hover:border-primary/20 hover:shadow-md transition-all group text-left active:scale-[0.98]"
                    >
                       <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                          <s.icon size={12} strokeWidth={2.5} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-wide text-on-surface-variant group-hover:text-on-surface transition-colors line-clamp-1">
                          {s.label}
                       </span>
                    </button>
                 ))}
              </div>
           </div>
        )}

        {/* Message Feed */}
        <div className="space-y-6">
          {chatHistory.map((msg, i) => (
            <ChatMessageBubble key={i} message={msg} />
          ))}
          
          {isChatLoading && (
            <div className="flex justify-start animate-fade-in pl-1">
              <div className="bg-surface-container-high px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 border border-outline-variant/10 shadow-sm">
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-px" />
        </div>
      </div>
      
      {/* Input Area - Tactile */}
      <div className="p-4 bg-background border-t border-outline-variant/10 z-10 shrink-0">
        <form onSubmit={handleSendMessage} className="relative group">
            <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask follow-up..."
                disabled={isChatLoading || isSummarizing}
                className="w-full bg-surface-container-low border-2 border-outline-variant/10 focus:border-primary/30 focus:bg-surface-container rounded-2xl pl-4 pr-12 h-12 text-xs font-bold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 font-sans shadow-inner"
            />
            <button 
                type="submit"
                disabled={!chatInput.trim() || isChatLoading || isSummarizing}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-on-surface text-surface rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-0 disabled:scale-75 hover:bg-primary hover:text-on-primary"
            >
                {isChatLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} strokeWidth={3} />}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
