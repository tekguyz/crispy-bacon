
import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, User as UserIcon, Crown, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { triggerHaptic } from '../../services/hapticService';

interface UserAccountPopoverProps {
  isExpanded: boolean;
  onCloseMobile?: () => void;
}

export const UserAccountPopover: React.FC<UserAccountPopoverProps> = ({ isExpanded, onCloseMobile }) => {
  const { session, userProfile, signOut, setView, setShowUpgradeModal } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleAction = (view: AppView) => {
    triggerHaptic('light');
    setView(view);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSignOut = () => {
    triggerHaptic('heavy');
    signOut();
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handleUpgrade = () => {
    triggerHaptic('medium');
    setShowUpgradeModal(true);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const avatarUrl = session?.user?.user_metadata?.picture || userProfile?.avatar_url;
  const isPro = !!userProfile?.is_pro;
  
  // Clean logic for display name
  const rawName = userProfile?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Guest';
  const email = session?.user?.email;

  // Render logic to reduce redundancy
  const showHeaderInMenu = !isExpanded; 

  return (
    <div className={`relative ${!isExpanded ? 'flex justify-center' : 'px-3'}`} ref={menuRef}>
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => { triggerHaptic('light'); setIsOpen(!isOpen); }}
        className={`
          flex items-center gap-3 transition-all active:scale-[0.98] group outline-none
          ${!isExpanded ? 'w-10 h-10 justify-center' : 'w-full p-2 bg-surface-container-high/30 hover:bg-surface-container-high border border-transparent hover:border-outline-variant/10 rounded-2xl'}
          ${isOpen ? 'bg-surface-container-high border-outline-variant/10' : ''}
        `}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`
          relative rounded-xl overflow-hidden bg-surface-container flex items-center justify-center shrink-0 transition-all
          ${!isExpanded ? 'w-10 h-10 shadow-sm border border-outline-variant/20' : 'w-10 h-10 border border-outline-variant/10'}
          ${isPro ? 'ring-2 ring-primary/20' : ''}
        `}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={18} strokeWidth={2.5} className="text-on-surface-variant/40" />
          )}
        </div>
        
        {isExpanded && (
          <div className="flex flex-col items-start min-w-0 flex-1">
             <div className="flex items-center gap-1.5 w-full">
                <span className="text-[12px] font-black text-on-surface truncate">{rawName}</span>
                {isPro && <Crown size={10} className="text-primary fill-current shrink-0" />}
             </div>
             {email && <span className="text-[9px] font-medium text-on-surface-variant/60 truncate w-full text-left">{email}</span>}
          </div>
        )}

        {isExpanded && (
           <Settings size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors mr-1" />
        )}
      </button>

      {/* POPOVER MENU */}
      {isOpen && (
        <div 
          className={`
            absolute bottom-full left-0 mb-2 w-60 p-1.5 z-[200]
            bg-surface-container-high backdrop-blur-xl border border-outline-variant/10
            rounded-[1.5rem] shadow-2xl animate-scale-in origin-bottom-left ring-1 ring-black/5
            ${!isExpanded ? 'ml-2' : 'ml-0 w-full'}
          `}
          role="menu"
        >
          {/* Identity Header - ONLY shown if sidebar is collapsed */}
          {showHeaderInMenu && (
            <div className="px-4 py-3 mb-1.5 bg-surface-container rounded-xl border border-outline-variant/5">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-black uppercase tracking-tight text-on-surface truncate">
                  {rawName}
                </p>
                {isPro && <Crown size={12} className="text-primary fill-current" />}
              </div>
              <p className="text-[9px] font-medium text-on-surface-variant/50 truncate">
                {email || 'Local Account'}
              </p>
            </div>
          )}

          {/* Actions List - Standardized Apple/Linear style */}
          <div className="space-y-0.5" role="none">
            {!isPro && (
               <button 
                 onClick={handleUpgrade}
                 className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110 transition-all group mb-1.5"
               >
                  <div className="flex items-center gap-3">
                     <Crown size={14} fill="currentColor" strokeWidth={0} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Upgrade</span>
                  </div>
                  <ChevronRight size={14} className="opacity-60" />
               </button>
            )}

            <button 
              onClick={() => handleAction(AppView.SETTINGS)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-on-surface/5 transition-colors text-left group"
            >
              <div className="w-5 flex justify-center"><Settings size={16} className="text-on-surface-variant group-hover:text-on-surface transition-colors" /></div>
              <span className="text-[11px] font-bold text-on-surface">Preferences</span>
            </button>

            <button 
              onClick={() => handleAction(AppView.HELP)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-on-surface/5 transition-colors text-left group"
            >
              <div className="w-5 flex justify-center"><HelpCircle size={16} className="text-on-surface-variant group-hover:text-on-surface transition-colors" /></div>
              <span className="text-[11px] font-bold text-on-surface">Manual</span>
            </button>
          </div>

          <div className="h-px bg-outline-variant/10 mx-3 my-1.5" />

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-error/10 text-left group"
          >
            <div className="w-5 flex justify-center"><LogOut size={16} className="text-error/60 group-hover:text-error transition-colors" /></div>
            <span className="text-[11px] font-bold text-error opacity-80 group-hover:opacity-100">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
