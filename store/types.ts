
import { 
  UserProfile, InsightContent, Collection, Tag, SharedLink, 
  CalendarEvent, AppView, ThemeOption, AccentColor, TextSize, 
  ContentType, InsightTemplate, PersonaStyle, VoiceOption, VisualizerStyle, ChatMessage, ContextAttachment, SystemLogEntry
} from '../types';

export type ToastType = 'info' | 'success' | 'error' | 'warn';
export type RealtimeStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  modifiedTime: string;
}

export interface AuthSlice {
  session: any | null;
  userProfile: UserProfile | null;
  isSupabaseActive: boolean;
  authLoading: boolean;
  isGuest: boolean; 
  initAuth: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  continueAsGuest: () => void; 
  signOut: () => Promise<void>;
  ensureValidProviderToken: () => Promise<boolean>;
}

export interface DataSlice {
  insights: InsightContent[];
  collections: Collection[];
  tags: Tag[];
  monthlyUsageCount: number;
  publicSharedInsight: SharedLink | null;
  calendarMeetings: CalendarEvent[];
  isCalendarLoading: boolean;
  driveFiles: DriveFile[];
  isDriveLoading: boolean;
  isInitialLoading: boolean;

  fetchData: () => Promise<void>;
  fetchSingleInsight: (id: string) => Promise<void>;
  syncLocalQueue: (force?: boolean) => Promise<void>;
  clearLocalCache: () => Promise<void>;
  fetchCalendarMeetings: () => Promise<void>;
  fetchDriveFiles: () => Promise<void>;
  ingestDriveFiles: (files: DriveFile[], options: { template: InsightTemplate }) => Promise<void>;
  recoverOrphanedFiles: () => Promise<void>;
  
  pollInsightStatus: (id: string) => Promise<void>;
  deleteInsight: (id: string) => Promise<void>;
  deleteInsightForever: (id: string) => Promise<void>;
  restoreInsight: (id: string) => Promise<void>;
  
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkArchive: (ids: string[], archive: boolean) => Promise<void>;
  bulkPin: (ids: string[], pin: boolean) => Promise<void>;
  bulkRestore: (ids: string[]) => Promise<void>;
  bulkDeleteForever: (ids: string[]) => Promise<void>;

  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  toggleActionItemComplete: (id: string, index: number) => Promise<void>;

  createCollectionAction: (name: string) => Promise<void>;
  updateCollectionAction: (id: string, name: string) => Promise<void>;
  deleteCollectionAction: (id: string, name: string) => Promise<void>;
  addItemToCollectionAction: (itemId: string, collectionId: string) => Promise<void>;
  removeItemFromCollectionAction: (itemId: string, collectionId: string) => Promise<void>;
  createTagAction: (name: string) => Promise<void>;
  updateTagAction: (id: string, name: string) => Promise<void>;
  deleteTagAction: (id: string, name: string) => Promise<void>;
  addTagToItemAction: (itemId: string, tagId: string) => Promise<void>;
  removeTagFromItemAction: (itemId: string, tagId: string) => Promise<void>;

  fetchPublicInsight: (slug: string) => Promise<void>;
  createShareLink: (insight: InsightContent, options: { expiresHours: number | null, includeAudio: boolean, isCollaborative: boolean }) => Promise<string | undefined>;
  toggleSharedActionItem: (slug: string, index: number) => Promise<void>;
  importSharedInsight: (shared: SharedLink) => Promise<void>;
}

export interface UISlice {
  view: AppView;
  previousView: AppView;
  theme: ThemeOption;
  accentColor: AccentColor;
  textSize: TextSize;
  isSidebarCollapsed: boolean;
  hasSeenOnboarding: boolean;
  feedViewMode: 'grid' | 'list';
  toasts: ToastMessage[];
  systemLogs: SystemLogEntry[];
  realtimeStatus: RealtimeStatus;
  
  syncOnWifiOnly: boolean;
  personaStyle: PersonaStyle;
  storageUsage: number; 
  voiceSpeed: number;
  hapticIntensity: number;

  // Selection state
  selectedItemIds: string[];
  isSelectionMode: boolean;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  confirmation: {
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'neutral' | 'danger';
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
  showCollectionManagementModal: boolean;
  showTagManagementModal: boolean;
  showCaptureLab: boolean; 
  showInputModal: boolean;
  showHelpModal: boolean;
  showShareModal: boolean;
  showUpgradeModal: boolean;
  showProfileDrawer: boolean;
  showOnboarding: boolean;
  searchQuery: string;
  activeSourceTypeFilter: ContentType | 'all';
  activeCollectionFilterId: string | null;
  activeTagFilterIds: string[];
  activeDomainFilter: string | null;
  startDateFilter: string | null;
  endDateFilter: string | null;
  sortOrder: 'newest' | 'oldest' | 'updated';
  defaultExportFormat: 'markdown' | 'text' | 'json';

  setTheme: (theme: ThemeOption) => void;
  setAccentColor: (color: AccentColor) => void;
  setTextSize: (size: TextSize) => void;
  setView: (view: AppView) => void;
  setFeedViewMode: (mode: 'grid' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setSyncOnWifiOnly: (val: boolean) => void;
  setPersonaStyle: (style: PersonaStyle) => void;
  setVoiceSpeed: (speed: number) => void;
  setHapticIntensity: (intensity: number) => void;
  updateStorageUsage: () => Promise<void>;
  setRealtimeStatus: (status: RealtimeStatus) => void;
  setActiveSourceTypeFilter: (type: ContentType | 'all') => void;
  setActiveCollectionFilterId: (id: string | null) => void;
  toggleActiveTagFilter: (id: string) => void;
  setActiveDomainFilter: (domain: string | null) => void;
  setStartDateFilter: (date: string | null) => void;
  setEndDateFilter: (date: string | null) => void;
  setSortOrder: (order: 'newest' | 'oldest' | 'updated') => void;
  setDefaultExportFormat: (format: 'markdown' | 'text' | 'json') => void;
  setShowCollectionManagementModal: (show: boolean) => void;
  setShowTagManagementModal: (show: boolean) => void;
  setShowCaptureLab: (show: boolean) => void; 
  setShowInputModal: (show: boolean) => void;
  setShowHelpModal: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  setShowProfileDrawer: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: () => void;
  toggleSidebarCollapse: () => void;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  logSystemEvent: (message: string, level?: 'info' | 'warn' | 'error', details?: string) => void;
  openConfirmation: (options: {
    title?: string;
    message?: string;
    variant?: 'neutral' | 'danger';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  closeConfirmation: () => void;
}

export interface IntelligenceSlice {
  isProcessing: boolean;
  activeProcessCount: number; // Tracker for concurrent tasks
  importError: string | null;
  isRecording: boolean;
  isPaused: boolean;
  recordingStartTime: number | null;
  currentNote: string;
  currentIntent: string; 
  preferredVoice: VoiceOption;
  preferredTemplate: InsightTemplate;
  preferredFramework?: InsightTemplate;
  isSimpleMode: boolean;
  isEnhancedAudio: boolean;
  visualizerStyle: VisualizerStyle;
  isLiveAssistantActive: boolean;
  liveSession: any | null;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  isVoicePreviewLoading: boolean;
  isWarmingUp: boolean;
  selectedInsight: InsightContent | null;
  contextAttachments: ContextAttachment[];

  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setCurrentNote: (note: string) => void;
  setCurrentIntent: (intent: string) => void;
  setIsEnhancedAudio: (val: boolean) => void;
  setPreferredVoice: (voice: VoiceOption) => void;
  setPreferredTemplate: (template: InsightTemplate) => void;
  setIsSimpleMode: (isSimple: boolean) => void;
  cycleVisualizerStyle: () => void;
  clearImportError: () => void;
  setSelectedInsight: (insight: InsightContent | null) => Promise<void>;
  hydrateAudio: (insight: InsightContent) => Promise<void>;
  retryProcessing: (insight: InsightContent) => Promise<void>;
  processContent: (contentInput: string, type: ContentType, options?: { template?: InsightTemplate, refUrl?: string, autoOpen?: boolean }) => Promise<void>;
  processMeeting: (audioBlob: Blob, manualNotes: string, options?: { template?: InsightTemplate, refUrl?: string, durationSeconds?: number, intent?: string, autoOpen?: boolean }) => Promise<void>;
  startLiveAssistant: (insight: InsightContent) => void;
  stopLiveAssistant: () => void;
  setLiveSession: (session: any | null) => void;
  sendChatMessage: (message: string, insight: InsightContent) => Promise<void>;
  sendGlobalChatMessage: (message: string, insights: InsightContent[]) => Promise<void>;
  clearChat: () => void;
  addContextAttachment: (attachment: ContextAttachment) => void;
  removeContextAttachment: (id: string) => void;
  clearContextAttachments: () => void;
}

export type AppState = AuthSlice & UISlice & DataSlice & IntelligenceSlice;
