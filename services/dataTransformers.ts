
import { InsightContent, ContentType, Sentiment, ProcessingStatus } from '../types';

/**
 * Maps a raw Supabase insight into the structured InsightContent interface.
 */
export const mapSupabaseToInsight = (item: any): InsightContent => {
  const summaryData = item.summaries?.[0] || {};
  const isMeeting = item.source_type === ContentType.MEETING;
  
  const duration = item.duration_seconds || item.metadata?.durationSeconds || 0;

  // Handle potentially stringified JSON in processed_text
  let processedText = item.processed_text;
  if (typeof processedText === 'string' && (processedText.startsWith('[') || processedText.startsWith('{'))) {
    try {
      processedText = JSON.parse(processedText);
    } catch (e) {}
  }

  // Text Hygiene: Unescape literal newlines and surgically remove leading spaces after headers
  const cleanText = (txt: string) => {
    if (!txt) return "";
    return txt
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/(### [^\n]+\n+)\s+/g, '$1'); 
  };

  const summaryText = cleanText(summaryData.summary || "");
  
  // FIXED READING TIME: Strictly 200 words per minute based on the summary ONLY
  const wordCount = summaryText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const calculatedReadingTime = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  // Status Recovery Logic
  let status = (item.processing_status as ProcessingStatus) || ProcessingStatus.COMPLETED;
  const hasActionProgress = item.metadata?.completedActionIndices && item.metadata.completedActionIndices.length > 0;
  const hasIntelligence = (item.summaries && item.summaries.length > 0) || summaryText.length > 10;

  if ((hasIntelligence || hasActionProgress) && (status === ProcessingStatus.PROCESSING || status === ProcessingStatus.PENDING || status === ProcessingStatus.SYNCING)) {
    status = ProcessingStatus.COMPLETED;
  }

  return {
    id: item.id,
    user_id: item.user_id,
    created_at: item.created_at,
    title: item.title || (isMeeting ? "Voice Note" : "Web Research"),
    original_content: item.raw_content || item.source_url || '',
    type: item.source_type as ContentType,
    is_favorite: item.is_favorite,
    is_archived: item.is_archived,
    deleted_at: item.deleted_at,
    favicon_url: item.favicon_url,
    site_name: item.site_name,
    processed_text: processedText,
    summary: summaryText,
    highlights: (summaryData.highlights || []).map(cleanText), 
    topics: summaryData.topics || [],
    entities: summaryData.entities || [],
    action_items: (summaryData.action_items || []).map(cleanText),
    sentiment: (summaryData.sentiment as Sentiment) || Sentiment.NEUTRAL,
    metadata: {
      ...item.metadata,
      readingTimeMinutes: calculatedReadingTime,
      wordCount: wordCount,
      originalDate: item.created_at,
      durationSeconds: duration,
      audioUrl: isMeeting ? item.source_url : undefined,
      isDeepStrategist: !!summaryData.is_deep_strategist
    },
    collections: item.insight_collections?.map((ic: any) => ic.collections).filter(Boolean) || [],
    tags: item.insight_tags?.map((it: any) => it.tags).filter(Boolean) || [],
    processing_status: status,
    storage_path: item.storage_path,
    error_message: item.error_message
  };
};

/**
 * Formats the Discussion Summary.
 */
export const formatTranscript = (text: any): string => {
  if (!text) return '';
  let content = text;
  if (typeof content === 'string' && (content.trim().startsWith('[') || content.trim().startsWith('{'))) {
    try { content = JSON.parse(content); } catch (e) {}
  }
  if (Array.isArray(content)) {
    return content.map((turn: any) => `• ${turn.text || turn}`).join('\n\n');
  }
  return String(content).trim();
};

/**
 * Generates a tailored Markdown report.
 */
export const generateInsightMarkdownReport = (insight: InsightContent, target: 'notion' | 'obsidian' = 'notion'): string => {
  const dateStr = new Date(insight.created_at).toISOString().split('T')[0];
  
  const exportSummary = insight.summary
    .replace(/(### [^\n]+\n+)\s+/g, '$1') 
    .trim();

  let md = '';
  if (target === 'obsidian') {
    md += `---\ntitle: "${insight.title.replace(/"/g, '\\"')}"\ndate: ${dateStr}\n`;
    if (insight.site_name) md += `source: "${insight.site_name}"\n`;
    if (insight.type) md += `type: ${insight.type.toLowerCase()}\n`;
    if (insight.tags?.length) md += `tags: [${insight.tags.map(t => t.name).join(', ')}]\n`;
    md += `---\n\n`;
  }
  md += `# ${insight.title}\n\n`;
  if (target === 'notion') {
    if (insight.site_name) md += `**Source:** ${insight.site_name}\n`;
    md += `**Date:** ${new Date(insight.created_at).toLocaleDateString()}\n\n`;
  }
  md += `## Summary\n${exportSummary}\n\n`;
  if (insight.highlights?.length) {
    md += `### Key Takeaways\n`;
    insight.highlights.forEach(h => md += `- ${h.trim()}\n`);
    md += `\n`;
  }
  if (insight.action_items?.length) {
    md += `### Next Steps\n`;
    insight.action_items.forEach((item, i) => md += `${i + 1}. ${item.trim()}\n`);
    md += `\n`;
  }
  if (insight.processed_text) {
    md += `---\n\n### Raw Signal Trace\n\n${formatTranscript(insight.processed_text)}`;
  }
  return md;
};
