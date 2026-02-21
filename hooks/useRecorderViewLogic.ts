
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useMicrophone } from './useMicrophone';
import { useFocusTrap } from './useFocusTrap';
import { triggerHaptic } from '../services/hapticService';
import { InsightTemplate } from '../types';

export const useRecorderViewLogic = () => {
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

  useEffect(() => {
    if (showRecorder) {
      setLabView('setup');
      setLabError(null);
    }
  }, [showRecorder]);

  const onComplete = useCallback(async (blob: Blob, duration: number) => {
    if (duration < 3) {
      setLabError("Session too short.");
      setTimeout(() => setLabError(null), 5000);
      return;
    }

    if (isGuest) {
      openConfirmation({
        title: 'Save to Local Library',
        message: 'Sign in to summarize this research. Save it locally for now?',
        confirmLabel: 'Save & Sign In',
        onConfirm: () => {
          analyzeMeeting(blob, currentNote, { 
            template: selectedTemplate, 
            durationSeconds: duration, 
            intent: currentIntent,
            autoOpen: true 
          } as any);
          signOut(); 
        },
        onCancel: () => { 
          analyzeMeeting(blob, currentNote, { 
            template: selectedTemplate, 
            durationSeconds: duration, 
            intent: currentIntent,
            autoOpen: true 
          } as any);
          setShowRecorder(false); 
          setLabView('setup'); 
        }
      });
      return;
    }

    triggerHaptic('medium');
    analyzeMeeting(blob, currentNote, { 
      template: selectedTemplate, 
      durationSeconds: duration, 
      intent: currentIntent,
      autoOpen: true
    } as any);
  }, [openConfirmation, analyzeMeeting, currentNote, selectedTemplate, currentIntent, setShowRecorder, isGuest, signOut]);

  const { stream, elapsedTime, isRecording, isPaused, start, stop, pause, resume, error: recorderError, limit } = useMicrophone(onComplete);
  
  useEffect(() => {
    if (showRecorder && !isRecording && labView === 'setup' && window.innerWidth < 768) {
      setIncludeSystemAudio(false); 
      setLabView('recording'); 
      start(false);
    }
  }, [showRecorder, labView, isRecording, start]);

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

  const containerRef = useFocusTrap(showRecorder, handleClose);

  return {
    // State
    includeSystemAudio, setIncludeSystemAudio,
    selectedTemplate, setSelectedTemplate,
    labView, setLabView,
    labError, setLabError,
    isClosing,
    
    // Store values
    currentNote, setCurrentNote,
    showRecorder, isAnalyzing,
    userProfile, isGuest,
    
    // Microphone
    stream, elapsedTime, isRecording, isPaused, start, stop, pause, resume, recorderError, limit,
    
    // Handlers
    handleClose,
    containerRef
  };
};
