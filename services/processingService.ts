
import { supabase } from './supabaseClient';
import { analyzeContent } from './geminiService';
import { ContentType, ProcessingStatus, InsightTemplate, InsightContent } from '../types';
import { cleanPayload } from '../utils/signalUtils';

/**
 * SIGNAL PROCESSING SERVICE
 * Orchestrates the transition from Raw Input to Refined Recap.
 */

export const archiveRefinement = async (
  itemId: string,
  userId: string,
  recap: Partial<InsightContent>,
  existingMetadata: any
) => {
  // Merge existing metadata with new analysis metadata
  // New recap metadata takes precedence
  const mergedMetadata = {
    ...(existingMetadata || {}),
    ...(recap.metadata || {})
  };

  // Safe stringify for processed_text
  let safeProcessedText = recap.processed_text;
  if (safeProcessedText && typeof safeProcessedText !== 'string') {
    safeProcessedText = JSON.stringify(safeProcessedText);
  }

  const updatePayload = cleanPayload({
    title: recap.title,
    processing_status: ProcessingStatus.COMPLETED,
    processed_text: safeProcessedText,
    metadata: cleanPayload(mergedMetadata),
    updated_at: new Date().toISOString()
  });

  const { error: itemError } = await supabase
    .from('insights')
    .update(updatePayload)
    .eq('id', itemId);

  if (itemError) {
    console.error("Archive Refinement Error (Insights):", itemError);
    throw new Error(`Vault Sync Failed: ${itemError.message}`);
  }

  const { error: summaryError } = await supabase.from('summaries').insert([{
    insight_id: itemId,
    user_id: userId,
    summary: recap.summary,
    highlights: recap.highlights,
    topics: recap.topics,
    entities: recap.entities,
    action_items: recap.action_items,
    sentiment: recap.sentiment,
    reading_time: recap.metadata?.readingTimeMinutes || 1,
    is_deep_strategist: recap.metadata?.isDeepStrategist
  }]);

  if (summaryError) {
    console.error("Archive Refinement Error (Summaries):", summaryError);
    throw new Error(`Recap Archival Failed: ${summaryError.message}`);
  }
};

export const uploadSignalAudio = async (userId: string, itemId: string, blob: Blob) => {
  const mimeType = blob.type || "audio/webm";
  const ext = mimeType.includes('mpeg') ? 'mp3' : 'webm';
  const path = `${userId}/${itemId}.${ext}`;
  
  const { error: uploadError } = await supabase.storage
    .from('meetings')
    .upload(path, blob);
    
  if (uploadError) throw uploadError;
  return path;
};
