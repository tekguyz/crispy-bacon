
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Loader2, Activity, Sparkles, Zap, ChevronRight, ArrowRight, Bot, FileText, AlignLeft, MessageSquare } from 'lucide-react';
import { InsightContent, ProcessingStatus } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { BaconLogo } from '../../ui/Logo';

interface ChatDrawerProps {
  insight: InsightContent;
  isFailed: boolean;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ insight }) => {
  const { chatHistory, isChatLoading, sendChatMessage } = useAppStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isSummarizing = insight.processing_status === ProcessingStatus.PROCESSING || insight.processing_status === ProcessingStatus.PENDING;

  useEffect(() => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading]);

  const contextStats = useMemo(() => {
    const text = typeof insight.processed_text === 'string' ? insight.processed_text : JSON.stringify(insight.processed_text || '');
    const wordCount = text.trim().split(/\s+/).length;
    return { wordCount };
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
    { label: "Friction", icon: Activity, query: "Identify core friction points." },
    { label: "Decisions", icon: Zap, query: "List all decisions made." },
    { label: "Actions", icon: ChevronRight, query: "Synthesize next steps." },
    { label: "Metrics", icon: Sparkles, query: "Find key numbers." }
  ];

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest relative overflow-hidden">
      <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md z-10 h-14">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface-container-high text-primary rounded-lg flex items-center justify-center border border-outline-variant/10 shadow-inner">
                <MessageSquare size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface leading-none">CHAT</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSummarizing ? 'bg-primary animate-pulse' : 'bg-success'}`} />
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">
                    {isSummarizing ? 'Syncing' : 'Ready'}
                  </span>
              </div>
            </div>
         </div>
         <div className="flex items-center gap-2 px-2 py-1 bg-surface-container-high rounded-md border border-outline-variant/10">
            <span className="text-[8px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                {contextStats.wordCount > 0 ? `${(contextStats.wordCount / 1000).toFixed(1)}k Words` : 'Ready'}
            </span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 relative z-0 flex flex-col">
        {chatHistory.length === 0 && !isSummarizing && (
           <div className="mt-auto pb-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-4 opacity-40 px-1">
                 <BaconLogo className="w-4 h-4" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Direct Query</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(undefined, s.query)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container hover:border-primary/20 transition-all group text-left active:scale-[0.98]"
                    >
                       <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary shrink-0">
                          <s.icon size={12} strokeWidth={2.5} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-wide text-on-surface-variant group-hover:text-on-surface truncate">
                          {s.label}
                       </span>
                    </button>
                 ))}
              </div>
           </div>
        )}

        <div className="space-y-6">
          {chatHistory.map((msg, i) => (
            <ChatMessageBubble key={i} message={msg} />
          ))}
          {isChatLoading && (
            <div className="flex justify-start animate-fade-in pl-1">
              <div className="bg-surface-container-high px-3 py-2.5 rounded-2xl flex items-center gap-1.5 border border-outline-variant/10">
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-px" />
        </div>
      </div>
      
      <div className="p-4 bg-background border-t border-outline-variant/10 z-10 shrink-0 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pb-4">
        <form onSubmit={handleSendMessage} className="relative group">
            <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask follow-up..."
                disabled={isChatLoading || isSummarizing}
                className="w-full bg-surface-container-low border-2 border-outline-variant/10 focus:border-primary/30 rounded-2xl pl-4 pr-12 h-12 text-xs font-bold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 font-sans shadow-inner"
            />
            <button 
                type="submit"
                disabled={!chatInput.trim() || isChatLoading || isSummarizing}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-on-surface text-surface rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-0 disabled:scale-75"
            >
                <ArrowRight size={14} strokeWidth={3} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
