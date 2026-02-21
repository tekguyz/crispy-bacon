import { StateCreator } from 'zustand';
import { AppState, AssistantSlice } from './types';

/**
 * voicePersonaSlice v1.0.10
 * Refactored to remove direct client-side model generation.
 * All model interactions must flow through Netlify Functions.
 */
export const createVoicePersonaSlice: StateCreator<AppState, [], [], Partial<AssistantSlice>> = (set, get) => ({
  preferredVoice: (localStorage.getItem('preferredVoice') as any) || 'Zephyr',
  isVoicePreviewLoading: false,

  setPreferredVoice: async (preferredVoice) => { 
    set({ preferredVoice }); 
    localStorage.setItem('preferredVoice', preferredVoice);
    
    // V1.0.10: Direct TTS preview from client is disabled for security.
    // Transition to /.netlify/functions/tts in next deployment.
    get().addToast(`Voice set to ${preferredVoice}`, 'info');
  },
});