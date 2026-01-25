
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

  useEffect(() => {
    if (!isLiveAssistantActive) {
      if (engineRef.current) engineRef.current.disconnect();
      return;
    }

    lastActivityRef.current = Date.now();
    logSystemEvent("Assistant requested.");

    if (!selectedInsight) {
        engineRef.current?.connect("IDENTITY: Senior professional research partner.", preferredVoice || 'Zephyr');
        return;
    }

    // UNIFIED KNOWLEDGE PROTOCOL: Match text chat context
    const summaryText = selectedInsight.summary || "No summary available.";
    const highlightsText = (selectedInsight.highlights || []).join('; ');
    const nextStepsText = (selectedInsight.action_items || []).join('; ');

    const rawTrace = typeof selectedInsight.processed_text === 'string' 
        ? selectedInsight.processed_text 
        : JSON.stringify(selectedInsight.processed_text || "");

    const fullInstruction = `
      ROLE: Professional Research Partner.
      CONTEXT: "${selectedInsight.title}"
      
      SOURCE MATERIAL (RECAP):
      """
      SUMMARY: ${summaryText}
      KEY_TAKEAWAYS: ${highlightsText}
      NEXT_STEPS: ${nextStepsText}
      """
      
      SOURCE MATERIAL (RAW_TRACE):
      """
      ${rawTrace.substring(0, 30000)}
      """
      
      INSTRUCTIONS:
      - Answer questions based ONLY on the provided source materials.
      - Use the RECAP for executive context and the RAW_TRACE for specific evidence or names.
      - If you are asked about people (e.g. Joe, Sean, Rolando, Brock), consult BOTH the Recap and Raw Trace.
      - Be direct, professional, and efficient. No fluff.
    `;

    engineRef.current?.connect(fullInstruction, preferredVoice || 'Zephyr');

  }, [isLiveAssistantActive, selectedInsight, preferredVoice, logSystemEvent]);

  return { status, volumeLevel, isSpeaking, timeToAutoKill };
};
