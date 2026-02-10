
import { StateCreator } from 'zustand';
import { AppState, UISlice, ToastMessage, ToastType } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AppView, ContentType, PersonaStyle, SystemLogEntry, ThemeOption } from '../types';
import { triggerHaptic } from '../services/hapticService';

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  view: AppView.DASHBOARD,
  previousView: AppView.DASHBOARD,
  theme: (localStorage.getItem('theme') as ThemeOption) || 'system',
  accentColor: 'orange',
  textSize: 'medium',
  isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === null ? true : localStorage.getItem('sidebarCollapsed') === 'true',
  hasSeenOnboarding: localStorage.getItem('hasSeenOnboarding_v1') === 'true',
  feedViewMode: (localStorage.getItem('feedViewMode') as 'grid' | 'list') || 'grid',
  toasts: [],
  systemLogs: [],
  realtimeStatus: 'idle',
  
  syncOnWifiOnly: localStorage.getItem('syncOnWifiOnly') === 'true',
  personaStyle: (localStorage.getItem('personaStyle') as PersonaStyle) || PersonaStyle.CONCISE,
  storageUsage: 0,
  voiceSpeed: parseFloat(localStorage.getItem('voiceSpeed') || '1.0'),
  hapticIntensity: parseFloat(localStorage.getItem('hapticIntensity') || '1.0'),

  // Selection Management
  selectedItemIds: [],
  isSelectionMode: false,

  toggleSelection: (id) => {
    triggerHaptic('light');
    const { selectedItemIds } = get();
    const isSelected = selectedItemIds.includes(id);
    const updated = isSelected 
      ? selectedItemIds.filter(item => item !== id) 
      : [...selectedItemIds, id];
    
    set({ 
      selectedItemIds: updated,
      isSelectionMode: updated.length > 0 
    });
  },

  clearSelection: () => {
    set({ selectedItemIds: [], isSelectionMode: false });
  },

  confirmation: {
    isOpen: false,
    title: '',
    message: '',
    variant: 'neutral',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => {},
  },
  showCollectionManagementModal: false,
  showTagManagementModal: false,
  showCaptureLab: false,
  showInputModal: false,
  showHelpModal: false,
  showShareModal: false,
  showUpgradeModal: false,
  showProfileDrawer: false,
  showOnboarding: false,
  showGlobalChat: false,
  searchQuery: '',
  activeSourceTypeFilter: 'all',
  activeCollectionFilterId: null,
  activeTagFilterIds: [],
  activeDomainFilter: null,
  startDateFilter: null,
  endDateFilter: null,
  sortOrder: 'newest',
  defaultExportFormat: (localStorage.getItem('defaultExportFormat') as any) || 'markdown',

  setTheme: (theme) => { 
    triggerHaptic('light');
    set({ theme }); 
    localStorage.setItem('theme', theme); 
    get().logSystemEvent(`Visual mode set: ${theme}`);
  },
  setAccentColor: () => {},
  setTextSize: () => {},
  setView: (view) => {
    triggerHaptic('light');
    get().clearSelection(); // Clear selection when changing views
    set(state => ({ view, previousView: state.view }));
  },
  setFeedViewMode: (mode) => { 
    triggerHaptic('light');
    set({ feedViewMode: mode }); 
    localStorage.setItem('feedViewMode', mode); 
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setSyncOnWifiOnly: (syncOnWifiOnly) => { 
    set({ syncOnWifiOnly }); 
    localStorage.setItem('syncOnWifiOnly', String(syncOnWifiOnly)); 
  },
  
  setPersonaStyle: (personaStyle) => { 
    triggerHaptic('light');
    set({ personaStyle }); 
    localStorage.setItem('personaStyle', personaStyle); 
  },

  setVoiceSpeed: (speed) => {
    set({ voiceSpeed: speed });
    localStorage.setItem('voiceSpeed', String(speed));
  },

  setHapticIntensity: (intensity) => {
    set({ hapticIntensity: intensity });
    localStorage.setItem('hapticIntensity', String(intensity));
    triggerHaptic('medium');
  },

  updateStorageUsage: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const estimate = await navigator.storage.estimate();
            set({ storageUsage: estimate.usage || 0 });
        } catch (e) {}
    }
  },

  setRealtimeStatus: (status) => set({ realtimeStatus: status }),

  setActiveSourceTypeFilter: (activeSourceTypeFilter) => {
    triggerHaptic('light');
    set({ activeSourceTypeFilter });
  },
  setActiveCollectionFilterId: (id) => {
    triggerHaptic('light');
    set({ activeCollectionFilterId: id });
  },
  toggleActiveTagFilter: (id) => {
    triggerHaptic('light');
    const current = get().activeTagFilterIds;
    set({ activeTagFilterIds: current.includes(id) ? current.filter(t => t !== id) : [...current, id] });
  },
  setActiveDomainFilter: (domain) => set({ activeDomainFilter: domain }),
  setStartDateFilter: (date) => set({ startDateFilter: date }),
  setEndDateFilter: (date) => set({ endDateFilter: date }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setDefaultExportFormat: (fmt) => { set({ defaultExportFormat: fmt }); localStorage.setItem('defaultExportFormat', fmt); },
  setShowCollectionManagementModal: (show) => { triggerHaptic('light'); set({ showCollectionManagementModal: show }); },
  setShowTagManagementModal: (show) => { triggerHaptic('light'); set({ showTagManagementModal: show }); },
  setShowCaptureLab: (show) => { triggerHaptic('light'); set({ showCaptureLab: show }); },
  setShowInputModal: (show) => { triggerHaptic('light'); set({ showInputModal: show }); },
  setShowHelpModal: (show) => { triggerHaptic('light'); set({ showHelpModal: show }); },
  setShowShareModal: (show) => { triggerHaptic('light'); set({ showShareModal: show }); },
  setShowUpgradeModal: (show) => { triggerHaptic('light'); set({ showUpgradeModal: show }); },
  setShowProfileDrawer: (show) => { triggerHaptic('light'); set({ showProfileDrawer: show }); },
  setShowOnboarding: (show) => { triggerHaptic('light'); set({ showOnboarding: show }); },
  setShowGlobalChat: (show) => { triggerHaptic('light'); set({ showGlobalChat: show }); },
  completeOnboarding: () => {
    triggerHaptic('medium');
    set({ hasSeenOnboarding: true, showOnboarding: false });
    localStorage.setItem('hasSeenOnboarding_v1', 'true');
  },
  toggleSidebarCollapse: () => {
    triggerHaptic('light');
    const newVal = !get().isSidebarCollapsed;
    set({ isSidebarCollapsed: newVal });
    localStorage.setItem('sidebarCollapsed', String(newVal));
  },
  addToast: (message, type = 'info') => {
    const id = uuidv4();
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  
  logSystemEvent: (message: string, level: 'info' | 'warn' | 'error' = 'info', details?: string) => {
    const entry: SystemLogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level,
        message,
        details
    };
    set(state => ({ systemLogs: [entry, ...state.systemLogs].slice(0, 50) }));
  },

  openConfirmation: (options) => {
    set({
      confirmation: {
        isOpen: true,
        title: options.title || 'Proceed?',
        message: options.message || 'Confirm this action.',
        variant: options.variant || 'neutral',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        onConfirm: options.onConfirm || (() => {}),
        onCancel: options.onCancel,
      }
    });
  },
  closeConfirmation: () => set(state => ({ confirmation: { ...state.confirmation, isOpen: false } })),
});
