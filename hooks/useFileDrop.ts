
import React, { useState, useCallback } from 'react';

export const useFileDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) setSelectedFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setSelectedFiles(files);
  }, []);

  const clearFiles = useCallback(() => setSelectedFiles([]), []);

  return { 
    isDragging, 
    selectedFiles, 
    setSelectedFiles,
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleFileSelect, 
    clearFiles 
  };
};