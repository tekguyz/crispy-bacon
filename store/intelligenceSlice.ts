
import { StateCreator } from 'zustand';
import { AppState, IntelligenceSlice } from './types';
import { InsightTemplate, AppView, ContentType, ProcessingStatus, InsightContent, VisualizerStyle } from '../types';
import { supabase } from '../services/supabaseClient';
import { getArtifactLocally } from '../services/localDbService';

export const createIntelligenceSlice: StateCreator<AppState, [], [], Partial<IntelligenceSlice>> = (set, get) => ({
  isProcessing: false,
  importError: null,
  isRecording: false,
  isPaused: false,
  recordingStartTime: null,
  currentNote: '',
  currentIntent: '', 
  preferredVoice: (localStorage.getItem('preferredVoice') as any) || 'Zephyr',
  preferredTemplate: (localStorage.getItem('preferredTemplate') as any) || InsightTemplate.EXECUTIVE,
  isSimpleMode: false,
  visualizerStyle: 'wave',
  isEnhancedAudio: localStorage.getItem('isEnhancedAudio') === 'true',
  selectedInsight: null,
  contextAttachments: [],

  setIsRecording: (isRecording) => set({ isRecording, recordingStartTime: isRecording ? Date.now() : null, isPaused: false }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setCurrentNote: (note) => set({ currentNote: note }),
  setCurrentIntent: (intent) => set({ currentIntent: intent }),
  setIsEnhancedAudio: (isEnhancedAudio) => { set({ isEnhancedAudio }); localStorage.setItem('isEnhancedAudio', String(isEnhancedAudio)); },
  setPreferredTemplate: (preferredTemplate) => { set({ preferredTemplate }); localStorage.setItem('preferredTemplate', preferredTemplate); },
  
  setIsSimpleMode: (isSimpleMode) => set({ isSimpleMode }),
  cycleVisualizerStyle: () => {
    const current = get().visualizerStyle;
    const styles: VisualizerStyle[] = ['bars', 'wave', 'pulse'];
    const next = styles[(styles.indexOf(current!) + 1) % styles.length];
    set({ visualizerStyle: next });
  },

  clearImportError: () => set({ importError: null }),
  
  hydrateAudio: async (insight: InsightContent) => {
    const isAudioSignal = insight.type === ContentType.MEETING || 
                          insight.storage_path?.match(/\.(mp3|wav|webm|m4a|ogg)$/i);

    if (!isAudioSignal) return;

    const isLocalSource = insight.metadata?.is_local || insight.processing_status === ProcessingStatus.LOCAL;

    if (isLocalSource || !insight.storage_path) {
        try {
            const artifact = await getArtifactLocally(insight.id);
            if (artifact && artifact.blob) {
                const localUrl = URL.createObjectURL(artifact.blob);
                const hydrated = {
                    ...insight,
                    metadata: { ...(insight.metadata || {}), audioUrl: localUrl }
                };
                if (get().selectedInsight?.id === insight.id) {
                    set({ selectedInsight: hydrated });
                }
                return;
            }
        } catch (e) {
            console.warn("[Audio] Local hydration deferred.");
        }
    }

    if (insight.storage_path) {
       try {
         const { data } = await supabase.storage
            .from('meetings')
            .createSignedUrl(insight.storage_path, 86400); 
         
         if (data?.signedUrl) {
            const hydrated = {
                ...insight,
                metadata: { ...(insight.metadata || {}), audioUrl: data.signedUrl }
            };
            if (get().selectedInsight?.id === insight.id) {
                set({ selectedInsight: hydrated });
            }
         }
       } catch (e) {
         console.warn("[Audio] Cloud hydration deferred.");
       }
    }
  },

  setSelectedInsight: async (insight: InsightContent | null) => {
    if (!insight) {
      set({ selectedInsight: null, chatHistory: [], view: get().previousView || AppView.DASHBOARD });
      get().stopLiveAssistant();
      return;
    }

    set({ 
        selectedInsight: insight, 
        chatHistory: [], 
        view: AppView.INSIGHT, 
        previousView: get().view 
    });

    await get().hydrateAudio(insight);
  },

  addContextAttachment: (attachment) => set(state => ({ contextAttachments: [...state.contextAttachments, attachment] })),
  removeContextAttachment: (id) => set(state => ({ contextAttachments: state.contextAttachments.filter(a => a.id !== id) })),
  clearContextAttachments: () => set({ contextAttachments: [] }),
});
