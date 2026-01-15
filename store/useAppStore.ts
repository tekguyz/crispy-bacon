import { create } from 'zustand';
import { AppState } from './types';
import { createAuthSlice } from './authSlice';
import { createUISlice } from './uiSlice';
import { createDataSlice } from './dataSlice';
import { createIntelligenceSlice } from './intelligenceSlice';
import { createProcessingSlice } from './processingSlice';
import { createVoicePersonaSlice } from './voicePersonaSlice';
import { createLiveSessionSlice } from './liveSessionSlice';

/**
 * Aggregated Global Store for Crispy Bacon.
 * Modularized into Slices for PH-grade maintainability.
 */
export const useAppStore = create<AppState>((set, get, ...a) => {
  // v1.9.9: SYSTEM WATCHDOG
  // If isProcessing gets stuck (e.g., Netlify function hangs), force release after 45s.
  let watchdog: number | null = null;

  const originalSet = set;
  
  // Refined wrapper for Zustand 5.x compatibility
  const wrappedSet: typeof set = (stateOrFn: any, replace?: any) => {
    const nextState = typeof stateOrFn === 'function' ? stateOrFn(get()) : stateOrFn;
    
    if (nextState && nextState.isProcessing === true) {
      if (watchdog) window.clearTimeout(watchdog);
      watchdog = window.setTimeout(() => {
        console.warn("[Watchdog] Resetting stuck engine state.");
        originalSet({ isProcessing: false } as any);
        if (get().logSystemEvent) {
            get().logSystemEvent("Analysis timeout. Signal released.", "warn");
        }
      }, 45000);
    } else if (nextState && nextState.isProcessing === false && watchdog) {
      window.clearTimeout(watchdog);
      watchdog = null;
    }
    
    return originalSet(stateOrFn, replace);
  };

  const monitoredSlices = {
    ...createAuthSlice(wrappedSet, get, ...a),
    ...createUISlice(wrappedSet, get, ...a),
    ...createDataSlice(wrappedSet, get, ...a),
    ...createIntelligenceSlice(wrappedSet, get, ...a),
    ...createProcessingSlice(wrappedSet, get, ...a),
    ...createVoicePersonaSlice(wrappedSet, get, ...a),
    ...createLiveSessionSlice(wrappedSet, get, ...a),
  };

  return monitoredSlices as AppState;
});