import { ContentType } from '../types';

interface ImportResult {
  raw_content: string;
  processed_text: string;
  title: string;
  favicon_url?: string;
  site_name?: string;
  source_url?: string;
  is_error?: boolean;
}

/**
 * Smart Content Import
 * URLs are passed to the model which uses web search to extract content.
 */
async function _prepareUrlForImport(url: string): Promise<ImportResult> {
  try {
    const siteName = new URL(url).hostname.replace('www.', '');
    
    return {
      raw_content: url,
      processed_text: `Import requested for: ${url}`,
      title: `Web Link: ${siteName}`,
      site_name: siteName,
      favicon_url: `https://www.google.com/s2/favicons?domain=${siteName}&sz=128`,
      source_url: url,
      is_error: false
    };
  } catch (error: any) {
    return {
      raw_content: "URL_MALFORMED",
      processed_text: `Error: The provided link format is invalid.`,
      title: `Invalid Link`,
      site_name: 'Unknown',
      source_url: url,
      is_error: true
    };
  }
}

async function _processPlainText(content: string): Promise<ImportResult> {
  return {
    raw_content: content,
    processed_text: content,
    title: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
    site_name: 'Manual Note',
  };
}

export async function importContent(content: string, type: ContentType): Promise<ImportResult> {
  switch (type) {
    case ContentType.URL:
      return _prepareUrlForImport(content);
    case ContentType.TEXT:
      return _processPlainText(content);
    default:
      return _processPlainText(content);
  }
}