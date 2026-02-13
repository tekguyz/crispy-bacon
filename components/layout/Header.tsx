
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, CircleX, Menu, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { triggerHaptic } from '../../services/hapticService';

const RealtimeStatusIndicator = () => {
  const status = useAppStore(state => state.realtimeStatus);
  const isGuest = useAppStore(state => state.isGuest);

  if (isGuest) return null;

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant/10 rounded-full group interactive h-7 shrink-0"
      aria-live="polite"
      role="status"
    >
       <div className="relative">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
            status === 'connected' ? 'bg-success' : 
            status === 'connecting' ? 'bg-primary animate-pulse' : 
            status === 'error' ? 'bg-error' : 'bg-on-surface-variant/20'
          }`} aria-hidden="true" />
       </div>
       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-hover:opacity-100 transition-opacity whitespace-nowrap">
         {status === 'connected' ? 'Synced' : status === 'connecting' ? 'Connecting' : 'Offline'}
       </span>
    </div>
  );
};

interface HeaderProps {
  onOpenSidebar: () => void;
  isSidebarExpanded: boolean;
  onToggleSidebarExpansion: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { 
    view, setView, searchQuery, setSearchQuery, 
    activeCollectionFilterId, collections,
    setShowGlobalChat
  } = useAppStore();
  
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery && !isSearchExpanded) {
      setIsSearchExpanded(true);
    }
  }, [searchQuery]);

  const getTitle = () => {
    if (activeCollectionFilterId) {
      const activeCol = collections.find(c => c.id === activeCollectionFilterId);
      return activeCol ? activeCol.name : 'Folder';
    }
    switch (view) {
      case AppView.DASHBOARD: return 'Overview';
      case AppView.FAVORITES: return 'Pinned';
      case AppView.ARCHIVED: return 'Archive';
      case AppView.SETTINGS: return 'Settings';
      case AppView.HELP: return 'Guide';
      case AppView.ALL: return 'History';
      default: return 'Bacon';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 0 && ![AppView.ALL, AppView.ARCHIVED, AppView.FAVORITES].includes(view)) {
      setView(AppView.ALL);
    }
  };

  const handleSearchAction = () => {
    triggerHaptic('light');
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
      setTimeout(() => searchInputRef.current?.focus(), 150);
    } else if (searchQuery.length > 0) {
      setSearchQuery('');
      searchInputRef.current?.focus();
    } else {
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="h-16 flex items-center px-4 md:px-8 bg-background sticky top-0 z-[45] border-b border-outline-variant justify-between gap-4" role="banner">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={() => { triggerHaptic('medium'); onOpenSidebar(); }}
          className="md:hidden w-11 h-11 -ml-1 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface-variant flex items-center justify-center shrink-0 interactive"
          aria-label="Open navigation menu"
        >
          <Menu size={20} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className={`flex items-center gap-3 min-w-0 transition-all duration-300 ${isSearchExpanded ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
          <h1 className="text-lg font-black text-on-surface tracking-tight whitespace-nowrap leading-none uppercase truncate">
            {getTitle()}
          </h1>
          <div className="hidden sm:block">
            <RealtimeStatusIndicator />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0 h-full">
          <div 
            className={`relative flex items-center transition-all duration-500 ease-spring ${isSearchExpanded ? 'w-56 md:w-96' : 'w-11'}`}
            role="search"
          >
             <div className={`absolute inset-0 bg-surface-container border border-outline-variant rounded-2xl transition-all duration-500 origin-right h-11 md:h-10 ${isSearchExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={14} aria-hidden="true" />
                <input 
                  ref={searchInputRef}
                  type="search" 
                  placeholder="Search notes..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-full bg-transparent pl-9 pr-10 text-[11px] font-black uppercase tracking-widest text-on-surface focus:outline-none placeholder:text-on-surface-variant/20"
                  aria-label="Search research library"
                />
             </div>

             <Tooltip content={isSearchExpanded ? (searchQuery ? "Clear search" : "Close search") : "Search Library"}>
                <button 
                  onClick={handleSearchAction}
                  className={`relative w-11 h-11 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 z-10 interactive ${isSearchExpanded ? 'bg-transparent text-primary ml-auto' : 'bg-surface-container border border-outline-variant/10 text-on-surface-variant shadow-sm'}`}
                  aria-label={isSearchExpanded ? "Close search bar" : "Expand search bar"}
                  aria-expanded={isSearchExpanded}
                >
                    {isSearchExpanded ? (
                      searchQuery.length > 0 ? <CircleX size={18} strokeWidth={3} className="animate-scale-in" aria-hidden="true" /> : <X size={18} strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <Search size={18} strokeWidth={3} aria-hidden="true" />
                    )}
                </button>
             </Tooltip>
          </div>

          <div className="w-px h-6 bg-outline-variant/20 hidden sm:block" aria-hidden="true" />

          {/* GLOBAL CHAT ACTION (Formerly in FloatingCommandCenter) */}
          <Tooltip content="Ask Library">
            <button 
              onClick={() => { triggerHaptic('medium'); setShowGlobalChat(true); }}
              className="w-11 h-11 md:w-10 md:h-10 rounded-xl bg-surface-container border border-outline-variant/10 text-primary flex items-center justify-center shadow-sm hover:border-primary/30 transition-all active:scale-90 group"
            >
               <Sparkles size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            </button>
          </Tooltip>
      </div>
    </header>
  );
};

export default Header;
