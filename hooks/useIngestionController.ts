
import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ContentType, InsightTemplate } from '../types';

const MAX_FILE_SIZE_MB = 45; // 5MB safety buffer for Supabase 50MB limit

export const useIngestionController = (selectedFiles: File[], clearFiles: () => void, onClose: () => void) => {
  const { 
    processContent, processMeeting, ingestDriveFiles, 
    isProcessing, preferredTemplate, addToast, userProfile,
    setCurrentIntent
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<ContentType | 'FILE' | 'DRIVE'>(ContentType.TEXT);
  const [inputValue, setInputValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<InsightTemplate>(preferredTemplate);

  const isPro = !!userProfile?.is_pro;

  const handleDriveSelect = async (files: any[]) => {
    if (!isPro) return;
    onClose();
    try {
      await ingestDriveFiles(files, { template: selectedTemplate });
    } catch (err: any) {
        addToast(`Import failed: ${err.message}`, "error");
    }
  };

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];
    const oversized: string[] = [];

    files.forEach(f => {
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        oversized.push(f.name);
      } else {
        valid.push(f);
      }
    });

    if (oversized.length > 0) {
      addToast(`Rejected: ${oversized.join(', ')} exceeds ${MAX_FILE_SIZE_MB}MB limit.`, "error");
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (isProcessing) return;

    const hasLink = urlValue.trim().length > 0;
    const hasNotes = inputValue.trim().length > 0;
    const validatedFiles = validateFiles(selectedFiles);

    if (!hasLink && validatedFiles.length === 0 && !hasNotes) return;

    // Smart Merging Strategy v2.0
    if (hasNotes && (hasLink || validatedFiles.length > 0)) {
        setCurrentIntent(inputValue);
    }

    const currentInputValue = inputValue;
    const currentUrlValue = urlValue;
    const currentTemplate = selectedTemplate;

    onClose();
    
    try {
      if (hasLink) {
        await processContent(currentUrlValue, ContentType.URL, { template: currentTemplate });
      } else if (validatedFiles.length > 0) {
        const audioFiles = validatedFiles.filter(f => f.type.startsWith('audio/'));
        const textFiles = validatedFiles.filter(f => 
          f.type === 'text/plain' || 
          f.name.toLowerCase().endsWith('.md') || 
          f.name.toLowerCase().endsWith('.txt')
        );

        if (audioFiles.length > 0) {
          // Current Limitation: Process primary audio file
          const firstFile = audioFiles[0];
          await processMeeting(firstFile, hasNotes ? currentInputValue : `Uploaded: ${firstFile.name}`, { template: currentTemplate } as any);
        } else if (textFiles.length > 0) {
          // BATCH CAPABILITY: Merge multiple text files into a single research dossier
          let mergedContent = "";
          for (const f of textFiles) {
            const text = await f.text();
            mergedContent += `\n\n--- SOURCE: ${f.name} ---\n${text}`;
          }
          if (hasNotes) mergedContent = `USER NOTES:\n${currentInputValue}\n\n${mergedContent}`;
          await processContent(mergedContent, ContentType.TEXT, { template: currentTemplate });
        }
      } else if (hasNotes) {
        await processContent(currentInputValue, ContentType.TEXT, { template: currentTemplate });
      }
    } catch (err: any) {
       console.error("[Ingestion] Submit Error:", err);
    }

    setInputValue('');
    setUrlValue('');
    clearFiles();
  };

  return {
    activeTab, setActiveTab,
    inputValue, setInputValue,
    urlValue, setUrlValue,
    selectedTemplate, setSelectedTemplate,
    handleDriveSelect,
    handleSubmit,
    isPro
  };
};
