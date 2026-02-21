
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useRecorderViewLogic } from '../../hooks/useRecorderViewLogic';
import { SummaryOverlay } from '../ui/SummaryOverlay';
import { AudioLevels } from './studio/AudioLevels';
import { StudioControls } from './studio/StudioControls';
import { ReferenceFiles } from './studio/ReferenceFiles';
import { MethodSelector } from './studio/MethodSelector';
import { PreFlightCheck } from './studio/PreFlightCheck';
import { RecorderHeader } from './studio/RecorderHeader';
import { MainEditor } from './studio/MainEditor';
import { ActionFooter } from './studio/ActionFooter';
import { triggerHaptic } from '../../services/hapticService';

const Recorder: React.FC = () => {
  const {
    includeSystemAudio, setIncludeSystemAudio,
    selectedTemplate, setSelectedTemplate,
    labView, setLabView,
    labError,
    isClosing,
    currentNote, setCurrentNote,
    showRecorder, isAnalyzing,
    userProfile, isGuest,
    stream, elapsedTime, isRecording, isPaused, start, stop, pause, resume, recorderError, limit,
    handleClose,
    containerRef
  } = useRecorderViewLogic();

  if (!showRecorder && !isRecording && !isAnalyzing) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" onClick={handleClose}> 
      <div 
        ref={containerRef}
        className={`bg-background w-full md:w-[calc(100%-2rem)] h-[92dvh] md:h-[85vh] md:max-h-[900px] md:max-w-7xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col transition-all border-t md:border border-outline-variant rounded-t-[2.5rem] md:rounded-[2.5rem] ${isRecording || isAnalyzing ? 'border-primary/20' : 'border-outline-variant'} ${isClosing ? 'animate-sheet-down' : 'md:animate-spring-up animate-sheet-up'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="md:hidden flex justify-center shrink-0 pt-3 pb-1">
            <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <RecorderHeader isRecording={isRecording} isAnalyzing={isAnalyzing} onClose={handleClose} view={labView} />

        <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
          {isAnalyzing ? (
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
                        <ReferenceFiles />
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

export default Recorder;
