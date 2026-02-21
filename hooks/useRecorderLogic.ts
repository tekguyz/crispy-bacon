import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useMicrophone } from './useMicrophone';
import { InsightTemplate } from '../types';
import { triggerHaptic } from '../services/hapticService';

export const useRecorderLogic = () => {
  const { 
    currentNote, setCurrentNote, currentIntent, analyzeMeeting, 
    setShowRecorder, showRecorder, isAnalyzing, 
    preferredTemplate, userProfile, openConfirmation, isGuest, signOut,
    addToast
  } = useAppStore();

  const [includeSystemAudio, setIncludeSystemAudio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InsightTemplate>(preferredTemplate);
  const [labView, setLabView] = useState<'setup' | 'prep' | 'recording'>('setup');
  const [labError, setLabError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when recorder opens
  useEffect(() => {
    if (showRecorder) {
      setLabView('setup');
      setLabError(null);
      setIsClosing(false);
    }
  }, [showRecorder]);

  const onComplete = useCallback(async (blob: Blob, duration: number) => {
    if (duration < 3) {
      setLabError("Session too short.");
      setTimeout(() => setLabError(null), 5000);
      return;
    }

    const processRecording = () => {
      triggerHaptic('medium');
      analyzeMeeting(blob, currentNote, { 
        template: selectedTemplate, 
        durationSeconds: duration, 
        intent: currentIntent,
        autoOpen: true
      } as any);
    };

    if (isGuest) {
      openConfirmation({
        title: 'Save to Local Library',
        message: 'Sign in to summarize this research. Save it locally for now?',
        confirmLabel: 'Save & Sign In',
        onConfirm: () => {
          processRecording();
          signOut(); 
        },
        onCancel: () => { 
          processRecording();
          setShowRecorder(false); 
          setLabView('setup'); 
        }
      });
      return;
    }

    processRecording();
  }, [openConfirmation, analyzeMeeting, currentNote, selectedTemplate, currentIntent, setShowRecorder, isGuest, signOut]);

  const microphone = useMicrophone(onComplete);
  const { isRecording, start } = microphone;

  // Auto-start on mobile
  useEffect(() => {
    if (showRecorder && !isRecording && labView === 'setup' && window.innerWidth < 768) {
      setIncludeSystemAudio(false); 
      setLabView('recording'); 
      start(false);
    }
  }, [showRecorder, labView, isRecording, start]);

  // Sync view with recording state
  useEffect(() => { 
    if (isRecording) { 
      setLabView('recording'); 
      setLabError(null); 
    } 
  }, [isRecording]);

  const handleClose = useCallback(() => { 
    if (isRecording) return;

    if (isAnalyzing) {
      addToast("Finishing up in background.", "info");
      setShowRecorder(false);
      setLabView('setup');
      return;
    }

    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setShowRecorder(false);
      setIsClosing(false);
      setLabView('setup');
    }, 300);
  }, [isRecording, isAnalyzing, setShowRecorder, addToast]);

  return {
    // State
    includeSystemAudio, setIncludeSystemAudio,
    selectedTemplate, setSelectedTemplate,
    labView, setLabView,
    labError, setLabError,
    isClosing,
    currentNote, setCurrentNote,
    
    // Store State
    showRecorder, isAnalyzing, isGuest, userProfile,

    // Actions
    handleClose,
    
    // Microphone
    microphone
  };
};
