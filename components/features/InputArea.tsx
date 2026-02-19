
import React, { useCallback, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useFileDrop } from '../../hooks/useFileDrop';
import { useIngestion } from '../../hooks/useIngestion';
import { SummaryOverlay } from '../ui/SummaryOverlay';
import { ImportHeader } from './ingest/ImportHeader';
import { ImportBody } from './ingest/ImportBody';
import { ImportFooter } from './ingest/ImportFooter';
import { triggerHaptic } from '../../services/hapticService';

const InputArea: React.FC = () => {
  const { 
    showInputModal, setShowInputModal, isProcessing, 
    importError, clearImportError, addToast, isGuest, signOut
  } = useAppStore();
  
  const [showDrive, setShowDrive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { 
    isDragging, selectedFiles, setSelectedFiles,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect, clearFiles 
  } = useFileDrop();

  const handleClose = useCallback(() => {
    // Immediate dismissal if processing to prevent race conditions with heavy main thread work
    if (isProcessing) {
      addToast("Finishing up in background.", "info");
      setShowInputModal(false);
      clearImportError();
      setShowDrive(false);
      return;
    }

    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setShowInputModal(false);
      setIsClosing(false);
      clearImportError();
      setShowDrive(false);
      clearFiles();
    }, 300);
  }, [isProcessing, setShowInputModal, clearImportError, addToast, clearFiles]);

  const {
    inputValue, setInputValue, urlValue, setUrlValue,
    selectedTemplate, setSelectedTemplate,
    handleDriveSelect, handleSubmit, isPro
  } = useIngestion(selectedFiles, clearFiles, handleClose);

  const containerRef = useFocusTrap(showInputModal, handleClose);

  if (!showInputModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" onClick={handleClose}> 
      <div 
        ref={containerRef}
        className={`bg-background w-full md:w-[calc(100%-2rem)] md:max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[92dvh] md:max-h-[90dvh] shadow-2xl overflow-hidden flex flex-col border-t md:border border-outline-variant focus:outline-none transition-all duration-300 ${isClosing ? 'animate-sheet-down' : 'md:animate-slide-up-lg animate-sheet-up'}`} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* M3 Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
           <div className="w-12 h-1 bg-outline-variant rounded-full" />
        </div>

        <ImportHeader onClose={handleClose} />

        <div className="flex-1 flex flex-col bg-background relative overflow-hidden overflow-y-auto custom-scrollbar"> 
           {isProcessing ? (
             <SummaryOverlay message="Reasoning..." isBackgroundable={true} onClose={handleClose} />
           ) : !importError && (
             <ImportBody 
                showDrive={showDrive} setShowDrive={setShowDrive}
                isPro={isPro} isProcessing={isProcessing}
                urlValue={urlValue} setUrlValue={setUrlValue}
                inputValue={inputValue} setInputValue={setInputValue}
                selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                handleDriveSelect={handleDriveSelect}
                fileDropProps={{ isDragging, selectedFiles, setSelectedFiles, handleDragOver, handleDragLeave, handleDrop, handleFileSelect }}
             />
           )}
        </div>

        <ImportFooter 
            isVisible={!importError && !showDrive}
            isProcessing={isProcessing}
            isGuest={isGuest}
            hasInput={urlValue.length > 0 || selectedFiles.length > 0 || inputValue.length > 0}
            onSubmit={() => { if (isGuest) { addToast("Authentication required.", "info"); signOut(); } else { handleSubmit(); } }}
        />
      </div>
    </div>
  );
};

export default InputArea;
