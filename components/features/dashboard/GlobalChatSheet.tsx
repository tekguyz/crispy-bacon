
import React, { useRef, useEffect, useState } from 'react';
import { Send, Loader2, MessageSquare, ArrowRight, Library, Sparkles } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { ChatMessageBubble } from '../InsightDetail/ChatMessageBubble';
import { SideSheet } from '../../ui/SideSheet';

interface GlobalChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalChatSheet: React.FC<GlobalChatSheetProps> = ({ isOpen, onClose }) => {
  const { chatHistory, isChatLoading, sendGlobalChatMessage, insights, clearChat } = useAppStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) clearChat(); // Reset chat when opening global mode
  }, [isOpen]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const handleSendMessage = async (e?: React.FormEvent, manualMsg?: string) => {
    if (e) e.preventDefault();
    const msg = manualMsg || chatInput;
    if (!msg.trim() || isChatLoading) return;
    
    triggerHaptic('light');
    setChatInput('');
    await sendGlobalChatMessage(msg, insights);
  };

  const suggestions = [
    "What are the recurring themes this week?",
    "List all action items assigned to engineering.",
    "Summarize the main friction points across recent calls.",
    "What decisions have we made about pricing?"
  ];

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} title="Library Intelligence">
      <div className="flex flex-col h-full bg-background relative">
        <div className="absolute inset-0 ledger-grid opacity-[0.02] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-0">
          {chatHistory.length === 0 && (
             <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                   <Library size={32} className="text-primary opacity-60" />
                </div>
                <div className="text-center max-w-xs space-y-2">
                   <h3 className="text-xl font-black uppercase tracking-tight text-on-surface">Ask Your Library</h3>
                   <p className="text-xs font-medium text-on-surface-variant opacity-60">
                     I can analyze your {Math.min(20, insights.length)} most recent notes to find patterns and answers.
                   </p>
                </div>
                <div className="w-full space-y-2">
                   {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSendMessage(undefined, s)}
                        className="w-full p-3 text-left text-[10px] font-bold text-on-surface-variant bg-surface-container-low border border-outline-variant/10 rounded-xl hover:text-primary hover:border-primary/20 transition-all active:scale-[0.98]"
                      >
                        <Sparkles size={10} className="inline mr-2 opacity-50" /> {s}
                      </button>
                   ))}
                </div>
             </div>
          )}

          <div className="space-y-6 pb-4">
            {chatHistory.map((msg, i) => (
              <ChatMessageBubble key={i} message={msg} />
            ))}
            
            {isChatLoading && (
              <div className="flex justify-start animate-fade-in pl-2">
                <div className="bg-surface-container-high px-4 py-3 rounded-2xl flex items-center gap-2 border border-outline-variant/10 shadow-sm">
                   <Loader2 size={14} className="animate-spin text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Scanning Library...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-2" />
          </div>
        </div>
        
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 z-10 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center group">
              <input 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  placeholder="Query your research..."
                  disabled={isChatLoading}
                  autoFocus
                  className="w-full bg-surface-container-high/50 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl pl-5 pr-14 py-4 text-sm font-bold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 font-sans"
              />
              <button 
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="absolute right-2 w-10 h-10 bg-on-surface text-surface rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-0 disabled:scale-75"
              >
                  <ArrowRight size={18} strokeWidth={3} />
              </button>
          </form>
        </div>
      </div>
    </SideSheet>
  );
};
