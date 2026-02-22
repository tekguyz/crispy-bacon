
import { StateCreator } from 'zustand';
import { AppState, AssistantSlice } from './types';
import { InsightContent, ChatMessage } from '../types';

export const createLiveSessionSlice: StateCreator<AppState, [], [], Partial<AssistantSlice>> = (set, get) => ({
  isLiveAssistantActive: false,
  liveSession: null,
  chatHistory: [],
  isChatLoading: false,
  isWarmingUp: false,

  startLiveAssistant: async (insight: InsightContent) => {
    if (get().liveSession) get().stopLiveAssistant();
    const { trackEvent } = await import('../services/analyticsService');
    trackEvent('voice_assistant_started', { insight_type: insight.type });
    set({ isLiveAssistantActive: true });
  },

  stopLiveAssistant: () => {
    const session = get().liveSession;
    if (session) try { session.close(); } catch(e) {}
    set({ isLiveAssistantActive: false, liveSession: null });
  },

  setLiveSession: (session) => set({ liveSession: session }),

  clearChat: () => set({ chatHistory: [] }),

  sendChatMessage: async (message: string, insight: InsightContent) => {
    const currentHistory = get().chatHistory;
    const newHistory: ChatMessage[] = [...currentHistory, { role: 'user', text: message }];
    
    const transcriptText = typeof insight.processed_text === 'string' 
      ? insight.processed_text 
      : JSON.stringify(insight.processed_text || "");
    const rawContentText = insight.original_content || "";
    const primaryContext = (rawContentText.length > transcriptText.length) 
        ? rawContentText 
        : transcriptText;

    const meetsThreshold = primaryContext.length > 130000;
    const isFirstTurn = currentHistory.length === 0;
    const needsWarmup = !!get().userProfile?.is_pro && meetsThreshold && !insight.metadata?.contextCacheName && isFirstTurn;

    set({ chatHistory: newHistory, isChatLoading: true, isWarmingUp: needsWarmup });

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          transcript: transcriptText || insight.summary,
          rawContent: rawContentText, 
          analysis: insight, 
          history: currentHistory,
          isPro: get().userProfile?.is_pro,
          itemId: insight.id
        }),
      });
      
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data?.error || "Server Error");

      set({ 
        chatHistory: [...newHistory, { role: 'model', text: data.text, sources: data.sources, usage: data.usage }], 
        isChatLoading: false,
        isWarmingUp: false
      });
    } catch (error: any) { 
      set({ isChatLoading: false, isWarmingUp: false, chatHistory: [...newHistory, { role: 'model', text: `⚠️ ${error.message}` }] }); 
    }
  },

  sendGlobalChatMessage: async (message: string, insights: InsightContent[]) => {
    const currentHistory = get().chatHistory;
    const newHistory: ChatMessage[] = [...currentHistory, { role: 'user', text: message }];
    
    set({ chatHistory: newHistory, isChatLoading: true });

    const contextData = insights.slice(0, 20).map(i => `[${new Date(i.created_at).toLocaleDateString()} - ${i.title}]: ${i.summary}`).join('\n\n');

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          history: currentHistory,
          contextType: 'global',
          globalContext: contextData
        }),
      });
      
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data?.error || "Server Error");

      set({ 
        chatHistory: [...newHistory, { role: 'model', text: data.text, usage: data.usage }], 
        isChatLoading: false 
      });
    } catch (error: any) { 
      set({ isChatLoading: false, chatHistory: [...newHistory, { role: 'model', text: `⚠️ ${error.message}` }] }); 
    }
  }
});