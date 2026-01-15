
export enum ContentType {
  MEETING = 'MEETING',
  URL = 'URL',
  TEXT = 'TEXT',
  VIDEO = 'VIDEO'
}

export enum ProcessingStatus {
  LOCAL = 'local',
  SYNCING = 'syncing',
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum InsightTemplate {
  EXECUTIVE = 'EXECUTIVE_BRIEF',
  PRODUCT = 'PRODUCT_DISCOVERY',
  ENGINEERING = 'ENGINEERING_SYNC',
  STAKEHOLDER = 'STAKEHOLDER_REVIEW'
}

export enum PersonaStyle {
  CONCISE = 'CONCISE',
  DEEP_RESEARCH = 'DEEP_RESEARCH'
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
  COMPLEX = 'COMPLEX'
}

export type AccentColor = 'orange' | 'blue' | 'green' | 'purple' | 'red';

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  is_pro: boolean;
  updated_at: string;
}

export interface ContextAttachment {
  id: string;
  type: 'LINK' | 'FILE' | 'INSIGHT';
  title: string;
  content: string; 
  metadata?: Record<string, any>;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface InsightMetadata {
  readingTimeMinutes?: number;
  wordCount?: number; 
  sourceDomain?: string;
  originalDate?: string;
  originalName?: string;
  audioUrl?: string;
  durationSeconds?: number;
  attendees?: string[];
  template?: InsightTemplate;
  personaStyle?: PersonaStyle;
  customIntent?: string;
  completedActionIndices?: number[];
  isHighAnalysis?: boolean;
  isDetailedAnalyst?: boolean;
  isDeepStrategist?: boolean;
  clarityScore?: number;
  friction?: string; 
  momentumScore?: number; 
  velocityScore?: number;
  isLowContext?: boolean;
  contextCacheName?: string;
  modelUsed?: string;
  contextAttachments?: ContextAttachment[];
  discussionSummary?: string;
  is_local?: boolean; 
  sync_attempts?: number;
  version?: number;
  mimeType?: string;
  is_trash?: boolean;
  deleted_at?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    model: string;
    estimatedCost?: number;
  };
}

export interface InsightContent {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  title: string;
  original_content: string; 
  type: ContentType;
  favicon_url?: string;
  site_name?: string;
  processed_text?: string;
  summary: string;
  highlights: string[];
  topics: string[];
  entities: string[]; 
  action_items: string[];
  sentiment: Sentiment;
  metadata?: InsightMetadata;
  collections?: Collection[];
  tags?: Tag[];
  is_favorite: boolean;
  is_archived: boolean;
  deleted_at?: string | null;
  processing_status: ProcessingStatus;
  storage_path?: string;
  error_message?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ALL = 'ALL',
  FAVORITES = 'FAVORITES',
  ARCHIVED = 'ARCHIVED',
  TRASH = 'TRASH',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP',
  INSIGHT = 'INSIGHT',
  PUBLIC_SHARE = 'PUBLIC_SHARE',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  AI_ETHICS = 'AI_ETHICS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  linkedTasks?: string[];
}

export type ThemeOption = 'light' | 'dark' | 'system';
export type VoiceOption = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
export type TextSize = 'small' | 'medium' | 'large' | 'huge';
export type VisualizerStyle = 'bars' | 'wave' | 'pulse';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: string;
}

export interface SharedLink {
  slug: string;
  insight_id: string;
  user_id: string;
  title: string;
  summary: string;
  highlights: string[];
  action_items: string[];
  processed_text: string;
  audio_url?: string | null;
  sentiment: Sentiment;
  site_name: string;
  is_collaborative: boolean;
  completed_indices: number[];
  expires_at?: string | null;
  version: number;
  created_at: string;
}
