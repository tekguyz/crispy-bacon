import { InsightContent, ContentType, Sentiment, ProcessingStatus } from '../types';

/**
 * Maps a raw Supabase insight into the structured InsightContent interface.
 * Implements "Signal Healing" to prevent stuck 'Thinking' states.
 */
export const mapSupabaseToInsight = (item: any): InsightContent => {
  const summaryData = item.summaries?.[0] || {};
  const hasSummary = item.summaries && item.summaries.length > 0;
  const isMeeting = item.source_type === ContentType.MEETING;
  
  const duration = item.duration_seconds || item.metadata?.durationSeconds || 0;

  // Handle potentially stringified JSON in processed_text
  let processedText = item.processed_text;
  if (typeof processedText === 'string' && (processedText.startsWith('[') || processedText.startsWith('{'))) {
    try {
      processedText = JSON.parse(processedText);
    } catch (e) {}
  }

  const summaryText = summaryData.summary || "";
  const wordCount = summaryText.trim().split(/\s+/).length;
  const calculatedReadingTime = Math.ceil(wordCount / 200);
  const finalReadingTime = summaryData.reading_time || calculatedReadingTime || 1;

  // CRITICAL HEALING LOGIC v2
  let status = (item.processing_status as ProcessingStatus) || ProcessingStatus.COMPLETED;
  
  const hasActionProgress = item.metadata?.completedActionIndices && item.metadata.completedActionIndices.length > 0;
  const hasIntelligence = hasSummary || summaryText.length > 10 || (item.highlights && item.highlights.length > 0);

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
    highlights: summaryData.highlights || [], 
    topics: summaryData.topics || [],
    entities: summaryData.entities || [],
    action_items: summaryData.action_items || [],
    sentiment: (summaryData.sentiment as Sentiment) || Sentiment.NEUTRAL,
    metadata: {
      ...item.metadata,
      readingTimeMinutes: finalReadingTime,
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
    try {
      content = JSON.parse(content);
    } catch (e) {}
  }
  
  if (Array.isArray(content)) {
    return content.map((turn: any) => {
      const line = turn.text || turn;
      return `• ${line}`;
    }).join('\n\n');
  }

  return String(content).trim();
};

/**
 * Generates a clean Markdown report from an insight for export.
 * Supports specific tailoring for Notion vs Obsidian.
 */
export const generateInsightMarkdownReport = (insight: InsightContent, target: 'notion' | 'obsidian' = 'notion'): string => {
  const date = new Date(insight.created_at).toISOString().split('T')[0];
  let md = '';

  if (target === 'obsidian') {
    // Add YAML Frontmatter for Obsidian properties
    md += `---\n`;
    md += `title: "${insight.title.replace(/"/g, '\\"')}"\n`;
    md += `date: ${date}\n`;
    if (insight.site_name) md += `source: "${insight.site_name}"\n`;
    if (insight.type) md += `type: ${insight.type.toLowerCase()}\n`;
    if (insight.tags?.length) {
      md += `tags: [${insight.tags.map(t => t.name).join(', ')}]\n`;
    }
    md += `---\n\n`;
  }

  md += `# ${insight.title}\n\n`;
  if (target === 'notion' && insight.site_name) md += `**Source:** ${insight.site_name}\n`;
  if (target === 'notion') md += `**Date:** ${new Date(insight.created_at).toLocaleDateString()}\n`;
  
  md += `\n---\n\n`;
  md += `## Summary\n${insight.summary}\n\n`;
  
  if (insight.highlights?.length) {
    md += `## Key Takeaways\n`;
    insight.highlights.forEach(h => md += `- ${h}\n`);
    md += `\n`;
  }
  
  if (insight.action_items?.length) {
    md += `## Next Steps\n`;
    insight.action_items.forEach((item, i) => md += `${i + 1}. ${item}\n`);
    md += `\n`;
  }

  if (insight.processed_text) {
    md += `---\n\n## Raw Signal Trace\n\n`;
    md += formatTranscript(insight.processed_text);
  }
  
  return md;
};