
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LiveEngine } from '../services/liveEngine';

export type SessionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export const useLiveSession = () => {
  const { 
    isLiveAssistantActive, 
    stopLiveAssistant, 
    selectedInsight, 
    addToast, 
    preferredVoice,
    logSystemEvent
  } = useAppStore();
  
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeToAutoKill, setTimeToAutoKill] = useState<number | null>(null);

  const engineRef = useRef<LiveEngine | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const AUTO_KILL_MS = 3 * 60 * 1000; 

  // Initialize Engine
  useEffect(() => {
    engineRef.current = new LiveEngine({
      onStatusChange: (s) => setStatus(s),
      onVolumeUpdate: (v) => {
        setVolumeLevel(v);
        if (v > 0.05) lastActivityRef.current = Date.now();
      },
      onSpeakingChanged: (speaking) => {
        setIsSpeaking(speaking);
        if (speaking) lastActivityRef.current = Date.now();
      },
      onError: () => addToast("Assistant connection deferred.", "error")
    });

    return () => {
      if (engineRef.current) engineRef.current.disconnect();
    };
  }, [addToast]);

  // Activity Monitor
  useEffect(() => {
    if (!isLiveAssistantActive || status !== 'connected') return;

    const interval = setInterval(() => {
        const idleTime = Date.now() - lastActivityRef.current;
        const remaining = AUTO_KILL_MS - idleTime;

        if (remaining <= 0) {
            stopLiveAssistant();
            addToast("Session closed due to inactivity.", "info");
        } else if (remaining < 30000) {
            setTimeToAutoKill(Math.ceil(remaining / 1000));
        } else {
            setTimeToAutoKill(null);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveAssistantActive, status, stopLiveAssistant, addToast]);

  // Connection Lifecycle
  useEffect(() => {
    if (!isLiveAssistantActive) {
      if (engineRef.current) engineRef.current.disconnect();
      return;
    }

    lastActivityRef.current = Date.now();
    logSystemEvent("Assistant requested.");

    const trace = typeof selectedInsight?.processed_text === 'string' 
        ? selectedInsight.processed_text 
        : JSON.stringify(selectedInsight?.processed_text || "");

    const instruction = selectedInsight 
        ? `You are a professional research partner discussing: "${selectedInsight.title}". Context: """${trace.substring(0, 50000)}""". Answer follow-up questions directly.` 
        : "IDENTITY: Senior professional research partner.";

    engineRef.current?.connect(instruction, preferredVoice || 'Zephyr');

  }, [isLiveAssistantActive, selectedInsight, preferredVoice, logSystemEvent]);

  return { status, volumeLevel, isSpeaking, timeToAutoKill };
};
