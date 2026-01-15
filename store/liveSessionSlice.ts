
import { StateCreator } from 'zustand';
import { AppState, IntelligenceSlice } from './types';
import { trackEvent } from '../services/analyticsService';
import { InsightContent, ChatMessage } from '../types';

export const createLiveSessionSlice: StateCreator<AppState, [], [], Partial<IntelligenceSlice>> = (set, get) => ({
  isLiveAssistantActive: false,
  liveSession: null,
  chatHistory: [],
  isChatLoading: false,
  isWarmingUp: false,

  startLiveAssistant: (insight: InsightContent) => {
    if (get().liveSession) get().stopLiveAssistant();
    trackEvent('voice_assistant_started', { insight_type: insight.type });
    set({ isLiveAssistantActive: true });
  },

  stopLiveAssistant: () => {
    const session = get().liveSession;
    if (session) try { session.close(); } catch(e) {}
    set({ isLiveAssistantActive: false, liveSession: null });
  },

  setLiveSession: (session) => set({ liveSession: session }),

  sendChatMessage: async (message: string, insight: InsightContent) => {
    const currentHistory = get().chatHistory;
    const newHistory: ChatMessage[] = [...currentHistory, { role: 'user', text: message }];
    
    const isPro = get().userProfile?.is_pro;
    
    // CONTEXT SELECTION LOGIC
    // We must prioritize the largest available text source to ensure quality.
    const transcriptText = typeof insight.processed_text === 'string' 
      ? insight.processed_text 
      : JSON.stringify(insight.processed_text || "");
    
    const rawContentText = insight.original_content || "";
    
    // Choose the heavy weight content if available, otherwise fallback to processed
    const primaryContext = (rawContentText.length > transcriptText.length) 
        ? rawContentText 
        : transcriptText;

    const meetsThreshold = primaryContext.length > 130000;
    const isFirstTurn = currentHistory.length === 0;
    const needsWarmup = isPro && meetsThreshold && !insight.metadata?.contextCacheName && isFirstTurn;

    set({ 
      chatHistory: newHistory, 
      isChatLoading: true,
      isWarmingUp: needsWarmup 
    });

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          // Send specific context fields, let backend choose, but we prioritize rawContent if it's substantial
          transcript: transcriptText || insight.summary,
          rawContent: rawContentText, 
          analysis: insight, 
          history: currentHistory,
          isPro: get().userProfile?.is_pro,
          itemId: insight.id
        }),
      });
      
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn("[Chat] Received non-JSON response:", text.substring(0, 100));
        throw new Error(response.status === 504 ? "Server timeout. Content too long or busy." : `Server error (${response.status})`);
      }
      
      if (!response.ok || data.error) {
        throw new Error(data?.error || `Server Error ${response.status}`);
      }

      if (data.contextCacheName && !insight.metadata?.contextCacheName) {
          const updatedInsights = get().insights.map(i => 
            i.id === insight.id 
              ? { ...i, metadata: { ...i.metadata, contextCacheName: data.contextCacheName } } 
              : i
          );
          set({ 
            insights: updatedInsights,
            selectedInsight: get().selectedInsight?.id === insight.id 
              ? { ...get().selectedInsight!, metadata: { ...get().selectedInsight!.metadata, contextCacheName: data.contextCacheName } } 
              : get().selectedInsight
          });
      }

      const modelText = data.text || "The assistant could not generate a response.";

      set({ 
        chatHistory: [...newHistory, { 
          role: 'model', 
          text: modelText, 
          sources: data.sources 
        }], 
        isChatLoading: false,
        isWarmingUp: false
      });
    } catch (error: any) { 
      console.error("Chat Error:", error);
      set({ 
        isChatLoading: false, 
        isWarmingUp: false,
        chatHistory: [...newHistory, { 
          role: 'model', 
          text: `⚠️ ${error.message || "Connection interrupted."}`
        }]
      }); 
    }
  },

  clearChat: () => set({ chatHistory: [], isWarmingUp: false }),
});