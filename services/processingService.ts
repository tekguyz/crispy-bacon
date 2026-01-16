import { supabase } from './supabaseClient';
import { analyzeContent } from './geminiService';
import { ContentType, ProcessingStatus, InsightTemplate, InsightContent } from '../types';
import { cleanPayload } from '../utils/signalUtils';

/**
 * SIGNAL PROCESSING SERVICE
 * Orchestrates the transition from Raw Input to Refined Recap.
 * Includes v2.0 Auto-Tagging Protocol.
 */

export const archiveRefinement = async (
  itemId: string,
  userId: string,
  recap: Partial<InsightContent>,
  existingMetadata: any
) => {
  // 1. Merge Metadata
  const mergedMetadata = {
    ...(existingMetadata || {}),
    ...(recap.metadata || {})
  };

  // Safe stringify for processed_text
  let safeProcessedText = recap.processed_text;
  if (safeProcessedText && typeof safeProcessedText !== 'string') {
    safeProcessedText = JSON.stringify(safeProcessedText);
  }

  // 2. Update Primary Insight Record
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

  if (itemError) throw new Error(`Vault Sync Failed: ${itemError.message}`);

  // 3. Insert Intelligence Summary
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

  if (summaryError) throw new Error(`Recap Archival Failed: ${summaryError.message}`);

  // 4. AUTO-TAGGING PROTOCOL
  // Convert AI generated topics into filterable system tags
  if (recap.topics && recap.topics.length > 0) {
    try {
      for (const topicName of recap.topics.slice(0, 5)) {
        const cleanName = topicName.toLowerCase().trim().replace(/#/g, '');
        if (!cleanName) continue;

        // Find or Create Tag
        let { data: tag, error: findError } = await supabase
          .from('tags')
          .select('id')
          .eq('user_id', userId)
          .eq('name', cleanName)
          .maybeSingle();

        if (!tag && !findError) {
          const { data: newTag, error: createError } = await supabase
            .from('tags')
            .insert({ user_id: userId, name: cleanName })
            .select('id')
            .single();
          if (!createError) tag = newTag;
        }

        // Link Tag to Insight
        if (tag) {
          await supabase
            .from('insight_tags')
            .upsert({ insight_id: itemId, tag_id: tag.id });
        }
      }
    } catch (tagErr) {
      console.warn("[AutoTag] Handshake deferred:", tagErr);
    }
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