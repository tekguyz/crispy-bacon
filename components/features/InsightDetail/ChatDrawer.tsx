
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronRight, ArrowRight, MessageSquare, ShieldAlert, Activity, Target, Hash, Sparkles, Mail, Feather } from 'lucide-react';
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

  // REFINED SUGGESTION ENGINE
  // Philosophy: Verbs & Objects. Max 2 words.
  const suggestions = useMemo(() => {
    const validTopics = (insight.topics || []).filter(t => t.length < 20);
    
    // 1. Context Specific (High Value)
    const contextSuggestions = [];
    
    // If we have explicit actions, offer to list them cleanly
    if (insight.action_items && insight.action_items.length > 0) {
       contextSuggestions.push({ 
         label: "Checklist", 
         icon: ShieldAlert, 
         query: "List all explicit action items and decisions as a checklist." 
       });
    }

    // 2. Topic Drill-down (Dynamic)
    // Only show the most relevant topic to avoid clutter
    if (validTopics.length > 0) {
      contextSuggestions.push({
        label: `Topic: ${validTopics[0]}`,
        icon: Hash,
        query: `Tell me more about ${validTopics[0]} and why it matters.`
      });
    }
    
    // 3. Template/Role Specific (Strategic)
    const template = insight.metadata?.template;
    if (template === InsightTemplate.ENGINEERING) {
      contextSuggestions.push({ label: "Blockers", icon: ShieldAlert, query: "What are the technical blockers or risks?" });
    } else if (template === InsightTemplate.PRODUCT) {
      contextSuggestions.push({ label: "Pain Points", icon: Activity, query: "Summarize user pain points and feedback." });
    } else if (template === InsightTemplate.EXECUTIVE) {
      contextSuggestions.push({ label: "Bottom Line", icon: Target, query: "What is the strategic bottom line?" });
    }

    // 4. Productivity Actions (Universal)
    // "Draft Email" is often more useful than "Key Takeaways" which is already on screen
    const defaults = [
      { label: "Draft Email", icon: Mail, query: "Draft a concise follow-up email to the team summarizing this." },
      { label: "Briefing", icon: Feather, query: "Create a 3-bullet executive briefing of this note." }
    ];

    // Merge & Dedupe: Context -> Topics -> Defaults
    const merged = [...contextSuggestions, ...defaults].slice(0, 4);
    
    return merged;
  }, [insight.topics, insight.metadata?.template, insight.action_items]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* HEADER: Cleaned up. Removed Word Count Pill. */}
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

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4 relative z-0 flex flex-col">
        {/* EMPTY STATE: Fills the void when history is empty */}
        {chatHistory.length === 0 && !isSummarizing && (
           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in z-0 pointer-events-none opacity-60 pb-20">
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
      
      {/* FOOTER: Suggestions + Input */}
      <div className="bg-background border-t border-outline-variant/10 z-10 shrink-0 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pb-4 flex flex-col gap-2">
        {/* Horizontal Suggestion Scroll - Updated Style: Smaller, Pill-shaped */}
        {!isChatLoading && !isSummarizing && (
            <div className="overflow-x-auto no-scrollbar flex gap-2 px-4 py-2 pt-3">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSendMessage(undefined, s.query)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container hover:border-primary/20 hover:text-primary transition-all group active:scale-[0.98] shadow-sm shrink-0 whitespace-nowrap"
                    >
                        <s.icon size={10} strokeWidth={2.5} className="text-on-surface-variant group-hover:text-primary transition-colors opacity-70" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
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
