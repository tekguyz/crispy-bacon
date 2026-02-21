import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFileDrop } from './useFileDrop';
import { useImport } from './useImport';
import { triggerHaptic } from '../services/hapticService';

export const useInputAreaLogic = () => {
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
    // Immediate dismissal if analyzing to prevent race conditions with heavy main thread work
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

  const importLogic = useImport(selectedFiles, clearFiles, handleClose);

  return {
    // State
    showDrive, setShowDrive,
    isClosing,
    isDragging, selectedFiles, setSelectedFiles,
    
    // Store State
    showImportModal, isAnalyzing, importError, isGuest, signOut, addToast,

    // Actions
    handleClose,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect,
    
    // Import Logic
    ...importLogic
  };
};
