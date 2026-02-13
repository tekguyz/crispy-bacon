
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Loader2, Activity, Sparkles, Zap, ChevronRight, ArrowRight, Bot, FileText, AlignLeft, MessageSquare, ShieldAlert, Code, Users, Briefcase, Target, Hash, HelpCircle } from 'lucide-react';
import { InsightContent, ProcessingStatus, InsightTemplate } from '../../../types';
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

  const handleSendMessage = async (e?: React.FormEvent, manualMsg?: string) => {
    if (e) e.preventDefault();
    const msg = manualMsg || chatInput;
    if (!msg.trim() || isChatLoading || isSummarizing) return;
    
    triggerHaptic('light');
    setChatInput('');
    await sendChatMessage(msg, insight);
  };

  // DYNAMIC SUGGESTION ENGINE v2
  // Prioritizes extracted topics (Guaranteed Hits) over generic templates.
  const suggestions = useMemo(() => {
    const validTopics = (insight.topics || []).filter(t => t.length < 25); // Filter out overly long generated topics
    
    // 1. Topic-Based Suggestions (High Signal / Guaranteed Answer)
    const topicSuggestions = validTopics.slice(0, 2).map(topic => ({
      label: topic,
      icon: Hash,
      query: `Summarize the key discussion points regarding "${topic}".`
    }));

    // 2. Context Aware (Guaranteed by new Backend Logic)
    const contextSuggestions = [];
    if (insight.action_items && insight.action_items.length > 0) {
       contextSuggestions.push({ label: "Checklist", icon: ShieldAlert, query: "List all explicit action items and next steps." });
    }
    
    // 3. Template-Specific Fallbacks 
    const template = insight.metadata?.template;
    if (template === InsightTemplate.ENGINEERING) {
      contextSuggestions.push({ label: "Blockers", icon: ShieldAlert, query: "What are the primary technical blockers or risks mentioned?" });
    } else if (template === InsightTemplate.PRODUCT) {
      contextSuggestions.push({ label: "User Pain", icon: Activity, query: "What specific user pain points or feedback was discussed?" });
    } else if (template === InsightTemplate.EXECUTIVE) {
      contextSuggestions.push({ label: "Bottom Line", icon: Target, query: "What is the strategic bottom line?" });
    }

    // 4. Universal Defaults (Safe Fallbacks)
    const defaults = [
      { label: "Key Takeaways", icon: Sparkles, query: "Give me the 3 most important takeaways from this note." },
      { label: "Next Steps", icon: ChevronRight, query: "List all explicit action items and next steps." }
    ];

    // Merge: Topics First -> Context -> Defaults. Cap at 5 items for the scroll bar.
    const merged = [...contextSuggestions, ...topicSuggestions, ...defaults].slice(0, 5);
    
    // Deduplicate labels just in case
    return merged.filter((item, index, self) => 
        index === self.findIndex((t) => (t.label === item.label))
    );
  }, [insight.topics, insight.metadata?.template, insight.action_items]);

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
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4 relative z-0 flex flex-col">
        {chatHistory.length === 0 && !isSummarizing && (
           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in z-0 pointer-events-none opacity-60">
              <div className="w-20 h-20 bg-surface-container-high rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-outline-variant/10 relative overflow-hidden">
                 <div className="absolute inset-0 ledger-grid opacity-[0.1]" />
                 <BaconLogo className="w-10 h-10 text-primary opacity-80" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface mb-3">Research Ready</h3>
              <p className="text-[10px] font-bold text-on-surface-variant opacity-50 text-center leading-relaxed max-w-[220px]">
                 I have analyzed this document. Ask about specific details, decisions, or next steps.
              </p>
           </div>
        )}

        <div className="space-y-6 relative z-10">
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
      
      {/* PERSISTENT SUGGESTION BAR + INPUT */}
      <div className="bg-background border-t border-outline-variant/10 z-10 shrink-0 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pb-4 flex flex-col gap-2">
        {/* Horizontal Suggestion Scroll */}
        {!isChatLoading && !isSummarizing && (
            <div className="overflow-x-auto no-scrollbar flex gap-2 px-4 py-2 pt-3">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSendMessage(undefined, s.query)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container hover:border-primary/20 hover:text-primary transition-all group active:scale-[0.98] shadow-sm shrink-0 whitespace-nowrap"
                    >
                        <s.icon size={10} strokeWidth={2.5} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-wide text-on-surface-variant group-hover:text-primary transition-colors">
                            {s.label}
                        </span>
                    </button>
                ))}
            </div>
        )}

        <form onSubmit={handleSendMessage} className="relative group px-4">
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
                className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-on-surface text-surface rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-0 disabled:scale-75"
            >
                <ArrowRight size={14} strokeWidth={3} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
