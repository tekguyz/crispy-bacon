
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ContentType, InsightTemplate } from '../types';
import { DriveFile } from '../store/types';
import mammoth from 'mammoth';

const MAX_FILE_SIZE_MB = 19.5; // Strictly under Gemini 20MB limit for inline data
const MAX_BATCH_COUNT = 5; 

export const useIngestion = (selectedFiles: File[], clearFiles: () => void, onClose: () => void) => {
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

  const handleDriveSelect = async (files: DriveFile[]) => {
    if (!isPro) return;
    if (files.length > MAX_BATCH_COUNT) {
        addToast(`Please select up to ${MAX_BATCH_COUNT} files.`, "warn");
        return;
    }
    onClose();
    try {
      // Drive files are always treated as batch/indirect imports, so they don't auto-open
      await ingestDriveFiles(files, { template: selectedTemplate });
    } catch (err: any) {
        addToast(`Ingestion issue: ${err.message}`, "error");
    }
  };

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];
    if (files.length > MAX_BATCH_COUNT) {
      addToast(`Processing the first ${MAX_BATCH_COUNT} files.`, "warn");
      files = files.slice(0, MAX_BATCH_COUNT);
    }

    files.forEach(f => {
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB <= MAX_FILE_SIZE_MB) valid.push(f);
      else addToast(`Excluded: ${f.name} exceeds 20MB AI limit.`, "error");
    });
    return valid;
  };

  const handleSubmit = async () => {
    if (isProcessing) return;
    const validatedFiles = validateFiles(selectedFiles);
    const hasLink = urlValue.trim().length > 0;
    const hasNotes = inputValue.trim().length > 0;
    
    if (!hasLink && validatedFiles.length === 0 && !hasNotes) return;

    // Logic: Auto-open only if there is EXACTLY one signal being added
    const signalCount = (hasLink ? 1 : 0) + validatedFiles.length + (!hasLink && validatedFiles.length === 0 && hasNotes ? 1 : 0);
    const autoOpen = signalCount === 1;

    onClose();
    try {
      if (hasLink) {
        if (hasNotes) setCurrentIntent(inputValue);
        await processContent(urlValue, ContentType.URL, { template: selectedTemplate, autoOpen });
      }

      for (const f of validatedFiles) {
        const isAudio = f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|webm|m4a)$/i);
        const isDocx = f.type.includes('word') || f.name.endsWith('.docx');
        const isText = f.type === 'text/plain' || f.name.match(/\.(md|txt)$/i);

        if (isAudio) {
          processMeeting(f, `Uploaded Note: ${f.name}`, { template: selectedTemplate, autoOpen } as any);
        } else if (isDocx) {
          const res = await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() });
          processContent(res.value, ContentType.TEXT, { template: selectedTemplate, autoOpen });
        } else if (isText) {
          processContent(await f.text(), ContentType.TEXT, { template: selectedTemplate, autoOpen });
        }
      }

      if (!hasLink && validatedFiles.length === 0 && hasNotes) {
        await processContent(inputValue, ContentType.TEXT, { template: selectedTemplate, autoOpen });
      }
    } catch (err: any) {
       addToast("Ingestion deferred.", "error");
    }
    setInputValue(''); setUrlValue(''); clearFiles();
  };

  return { activeTab, setActiveTab, inputValue, setInputValue, urlValue, setUrlValue, selectedTemplate, setSelectedTemplate, handleDriveSelect, handleSubmit, isPro };
};
