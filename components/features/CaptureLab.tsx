
import React, { useCallback, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMicrophone } from '../../hooks/useMicrophone';
import { useAppStore } from '../../store/useAppStore';
import { InsightTemplate } from '../../types';
import { SummaryOverlay } from '../ui/SummaryOverlay';
import { AudioLevels } from './studio/AudioLevels';
import { StudioControls } from './studio/StudioControls';
import { ContextDeck } from './studio/ContextDeck';
import { MethodSelector } from './studio/MethodSelector';
import { PreFlightCheck } from './studio/PreFlightCheck';
import { CaptureHeader } from './studio/CaptureHeader';
import { MainEditor } from './studio/MainEditor';
import { ActionFooter } from './studio/ActionFooter';
import { triggerHaptic } from '../../services/hapticService';

const CaptureLab: React.FC = () => {
  const { 
    currentNote, setCurrentNote, currentIntent, processMeeting, 
    setShowCaptureLab, showCaptureLab, isProcessing, 
    preferredTemplate, userProfile, openConfirmation, isGuest, signOut,
    addToast
  } = useAppStore();

  const [includeSystemAudio, setIncludeSystemAudio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InsightTemplate>(preferredTemplate);
  const [labView, setLabView] = useState<'setup' | 'prep' | 'recording'>('setup');
  const [labError, setLabError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showCaptureLab) {
      setLabView('setup');
      setLabError(null);
    }
  }, [showCaptureLab]);

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
          processMeeting(blob, currentNote, { 
            template: selectedTemplate, 
            durationSeconds: duration, 
            intent: currentIntent,
            autoOpen: true 
          } as any);
          signOut(); 
        },
        onCancel: () => { 
          processMeeting(blob, currentNote, { 
            template: selectedTemplate, 
            durationSeconds: duration, 
            intent: currentIntent,
            autoOpen: true 
          } as any);
          setShowCaptureLab(false); 
          setLabView('setup'); 
        }
      });
      return;
    }

    triggerHaptic('medium');
    // Finalized recordings always Constitute a single signal action -> autoOpen: true
    processMeeting(blob, currentNote, { 
      template: selectedTemplate, 
      durationSeconds: duration, 
      intent: currentIntent,
      autoOpen: true
    } as any);
  }, [openConfirmation, processMeeting, currentNote, selectedTemplate, currentIntent, setShowCaptureLab, isGuest, signOut]);

  const { stream, elapsedTime, isRecording, isPaused, start, stop, pause, resume, error: recorderError, limit } = useMicrophone(onComplete);
  
  useEffect(() => {
    if (showCaptureLab && !isRecording && labView === 'setup' && window.innerWidth < 768) {
      setIncludeSystemAudio(false); 
      setLabView('recording'); 
      start(false);
    }
  }, [showCaptureLab, labView, isRecording, start]);

  useEffect(() => { 
    if (isRecording) { 
      setLabView('recording'); 
      setLabError(null); 
    } 
  }, [isRecording]);

  const handleClose = useCallback(() => { 
    // Prevent closing while actively recording audio to avoid data loss without user intent
    if (isRecording) return;

    if (isProcessing) {
      addToast("Reasoning in background.", "info");
    }

    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setShowCaptureLab(false);
      setIsClosing(false);
      setLabView('setup');
    }, 300);
  }, [isRecording, isProcessing, setShowCaptureLab, addToast]);

  const containerRef = useFocusTrap(showCaptureLab, handleClose);

  if (!showCaptureLab && !isRecording && !isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" onClick={handleClose}> 
      <div 
        ref={containerRef}
        className={`bg-background w-full md:w-[calc(100%-2rem)] h-[92dvh] md:h-[85vh] md:max-h-[900px] md:max-w-7xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col transition-all border-t md:border border-outline-variant rounded-t-[2.5rem] md:rounded-[2.5rem] ${isRecording || isProcessing ? 'border-primary/20' : 'border-outline-variant'} ${isClosing ? 'animate-sheet-down' : 'md:animate-spring-up animate-sheet-up'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="md:hidden flex justify-center shrink-0 pt-3 pb-1">
           <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <CaptureHeader isRecording={isRecording} isProcessing={isProcessing} onClose={handleClose} view={labView} />

        <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
          {isProcessing ? (
             <SummaryOverlay message="Reasoning" isBackgroundable={true} onClose={handleClose} />
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {labView === 'setup' && <MethodSelector onSelect={(isSys) => { setIncludeSystemAudio(isSys); setLabView(isSys ? 'prep' : 'recording'); if(!isSys) start(false); }} isPro={!!userProfile?.is_pro} />}
              {labView === 'prep' && <PreFlightCheck onConfirm={() => start(true)} onCancel={() => setLabView('setup')} />}
              {labView === 'recording' && (
                <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <aside className="h-auto md:w-[280px] shrink-0 order-1 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/10 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        <AudioLevels stream={stream} elapsedTime={elapsedTime} isRecording={isRecording} isPaused={isPaused} limit={limit} />
                        <StudioControls selectedTemplate={selectedTemplate} onSetTemplate={setSelectedTemplate} disabled={false} isPro={!!userProfile?.is_pro} includeSystemAudio={includeSystemAudio} onSetIncludeSystem={setIncludeSystemAudio} />
                        <div className="h-px bg-outline-variant/10 w-full" />
                        <ContextDeck />
                      </div>
                    </aside>
                    <MainEditor value={currentNote} onChange={setCurrentNote} />
                  </div>
                  {(labError || recorderError) && (
                    <div className="px-6 py-2 bg-error text-white flex items-center gap-3 animate-slide-up font-black text-[9px] uppercase tracking-widest h-10 shrink-0" role="alert">
                       <AlertCircle size={12} strokeWidth={3} />
                       <span>{labError || recorderError}</span>
                    </div>
                  )}
                  <ActionFooter isPaused={isPaused} onPause={pause} onResume={resume} onStop={stop} isGuest={isGuest} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureLab;
