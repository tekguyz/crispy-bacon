
import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { startAudioCapture, stopAudioCapture, createRecorder } from '../services/audioService';

const LIMITS = {
  FREE: 15 * 60,  // 15 Minutes
  PRO: 60 * 60,   // 60 Minutes (Hard Cap)
};

const SILENCE_THRESHOLD = 0.01; // Very low amplitude
const SILENCE_DURATION_MS = 10000; // 10 seconds warning

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
  
  // Silence Detection
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
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

  const monitorSilence = (mediaStream: MediaStream) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    const source = ctx.createMediaStreamSource(mediaStream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let silenceStart = Date.now();
    let hasWarned = false;

    silenceTimerRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const average = sum / dataArray.length;
      const volume = average / 255;

      if (volume > SILENCE_THRESHOLD) {
        silenceStart = Date.now();
        hasWarned = false;
      } else {
        if (!hasWarned && Date.now() - silenceStart > SILENCE_DURATION_MS) {
          addToast("Signal flatline detected. Still recording?", "warn");
          hasWarned = true;
        }
      }
    }, 1000);
  };

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
      
      // Start Silence Monitor
      monitorSilence(mediaStream);
      
      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(currentElapsed);

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
      // Don't stop silence timer, but logic will ignore silence anyway since no new audio comes
    }
  }, [recorder, setIsPaused]);

  const resume = useCallback(() => {
    if (recorder && recorder.state === 'paused') {
      recorder.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - (elapsedTime * 1000);
    }
  }, [recorder, setIsPaused, elapsedTime]);

  useEffect(() => {
    return () => {
      stopTimer();
      releaseWakeLock();
      stopAudioCapture();
    };
  }, [releaseWakeLock, stopTimer]);

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
