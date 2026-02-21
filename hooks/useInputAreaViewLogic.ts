
import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFocusTrap } from './useFocusTrap';
import { useFileDrop } from './useFileDrop';
import { useImport } from './useImport';
import { triggerHaptic } from '../services/hapticService';

export const useInputAreaViewLogic = () => {
  const { 
    showImportModal, setShowImportModal, isAnalyzing, 
    importError, clearImportError, addToast, isGuest, signOut
  } = useAppStore();
  
  const [showDrive, setShowDrive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const { 
    isDragging, selectedFiles, setSelectedFiles,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect, clearFiles 
  } = useFileDrop();

  const handleClose = useCallback(() => {
    if (isAnalyzing) {
      addToast("Finishing up in background.", "info");
      setShowImportModal(false);
      clearImportError();
      setShowDrive(false);
      return;
    }

    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setShowImportModal(false);
      setIsClosing(false);
      clearImportError();
      setShowDrive(false);
      clearFiles();
    }, 300);
  }, [isAnalyzing, setShowImportModal, clearImportError, addToast, clearFiles]);

  const {
    inputValue, setInputValue, urlValue, setUrlValue,
    selectedTemplate, setSelectedTemplate,
    handleDriveSelect, handleSubmit, isPro
  } = useImport(selectedFiles, clearFiles, handleClose);

  const containerRef = useFocusTrap(showImportModal, handleClose);

  return {
    // State
    showDrive, setShowDrive,
    isClosing,
    
    // Store values
    showImportModal, isAnalyzing,
    importError, isGuest,
    
    // Hooks data
    fileDropProps: { isDragging, selectedFiles, setSelectedFiles, handleDragOver, handleDragLeave, handleDrop, handleFileSelect },
    importProps: { inputValue, setInputValue, urlValue, setUrlValue, selectedTemplate, setSelectedTemplate, handleDriveSelect, handleSubmit, isPro },
    
    // Handlers
    handleClose,
    containerRef,
    
    // Actions
    signOut,
    addToast
  };
};
