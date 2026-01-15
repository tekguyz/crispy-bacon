
import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { startAudioCapture, stopAudioCapture, createRecorder } from '../services/audioService';

const LIMITS = {
  FREE: 15 * 60,  // 15 Minutes
  PRO: 60 * 60,   // 60 Minutes (Hard Cap)
};

export const useMicrophone = (onComplete?: (blob: Blob, duration: number) => void) => {
  const { 
    isRecording, setIsRecording, 
    isPaused, setIsPaused, 
    addToast, userProfile
  } = useAppStore();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const finalDurationRef = useRef<number>(0);
  const wakeLockRef = useRef<any>(null);

  const sessionLimit = userProfile?.is_pro ? LIMITS.PRO : LIMITS.FREE;

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock failed:', err);
      }
    }
  };

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    try {
        if (recorder && recorder.state !== 'inactive') {
          recorder.stop();
        }
    } catch (err) {
        console.warn("[Hardware] Signal termination drift:", err);
    } finally {
        stopAudioCapture();
        stopTimer();
        
        const now = Date.now();
        const delta = Math.floor((now - startTimeRef.current) / 1000);
        finalDurationRef.current = delta;
        
        setIsRecording(false);
        setIsPaused(false);
        setRecorder(null);
        setStream(null);
        setElapsedTime(0);
        releaseWakeLock();
    }
  }, [recorder, setIsRecording, setIsPaused, releaseWakeLock, stopTimer]);

  const start = async (includeSystemAudio: boolean = false) => {
    try {
      setError(null);
      setElapsedTime(0);
      finalDurationRef.current = 0;

      const mediaStream = await startAudioCapture(includeSystemAudio);
      setStream(mediaStream);
      
      const mediaRecorder = createRecorder(mediaStream, (blob) => {
        if (onComplete) onComplete(blob, finalDurationRef.current);
      });

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(currentElapsed);

        // IRON-CLAD LIMIT GUARD: Auto-finalize at tier cap
        if (currentElapsed >= sessionLimit) {
            addToast(`Limit reached (${sessionLimit / 60}m). Auto-finalizing recap.`, "info");
            stop();
        }
      }, 1000);

      await requestWakeLock();
    } catch (err: any) {
      setError("Hardware access blocked.");
      setIsRecording(false);
      addToast("Microphone error: " + err.message, "error");
      stopAudioCapture();
    }
  };

  const pause = useCallback(() => {
    if (recorder && recorder.state === 'recording') {
      recorder.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [recorder, setIsPaused, stopTimer]);

  const resume = useCallback(() => {
    if (recorder && recorder.state === 'paused') {
      recorder.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - (elapsedTime * 1000);
      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(currentElapsed);
        
        if (currentElapsed >= sessionLimit) {
            stop();
        }
      }, 1000);
    }
  }, [recorder, setIsPaused, elapsedTime, sessionLimit, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      releaseWakeLock();
      stopAudioCapture();
    };
  }, [releaseWakeLock]);

  return {
    stream,
    isRecording,
    isPaused,
    elapsedTime,
    error,
    start,
    stop,
    pause,
    resume,
    limit: sessionLimit
  };
};
