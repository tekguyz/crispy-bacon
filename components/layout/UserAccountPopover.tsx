
import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, User as UserIcon, ShieldCheck, Crown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { triggerHaptic } from '../../services/hapticService';

interface UserAccountPopoverProps {
  isExpanded: boolean;
}

export const UserAccountPopover: React.FC<UserAccountPopoverProps> = ({ isExpanded }) => {
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
  };

  const handleSignOut = () => {
    triggerHaptic('heavy');
    signOut();
    setIsOpen(false);
  };

  const handleUpgrade = () => {
    triggerHaptic('medium');
    setShowUpgradeModal(true);
    setIsOpen(false);
  };

  const avatarUrl = session?.user?.user_metadata?.picture || userProfile?.avatar_url;
  const isPro = !!userProfile?.is_pro;
  const userName = userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className={`relative ${!isExpanded ? 'flex justify-center' : 'px-3'}`} ref={menuRef}>
      <button 
        onClick={() => { triggerHaptic('light'); setIsOpen(!isOpen); }}
        className={`flex items-center gap-3 transition-all active:scale-95 group outline-none ${!isExpanded ? 'w-10 h-10 justify-center' : 'w-full p-2 bg-surface-container-high/50 hover:bg-surface-container-high border border-outline-variant/10 rounded-2xl'}`}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`rounded-xl border-2 border-outline-variant/20 overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0 shadow-sm ${!isExpanded ? 'w-10 h-10' : 'w-9 h-9'}`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={18} strokeWidth={2.5} className="text-on-surface-variant/40" />
          )}
        </div>
        
        {isExpanded && (
          <div className="flex flex-col items-start min-w-0 flex-1">
             <span className="text-[11px] font-bold text-on-surface truncate w-full text-left">{userName}</span>
             <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest truncate">{isPro ? 'Executive' : 'Standard'}</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-full left-0 mb-3 w-64 bg-surface border border-outline rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-1.5 z-[100] animate-scale-in origin-bottom-left ring-1 ring-black/10 mx-2"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-5 py-4 mb-1 bg-surface-container-low rounded-[1.5rem]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-xs font-black uppercase tracking-tight text-on-surface truncate">
                {userName}
              </p>
              {isPro && (
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-primary text-on-primary shadow-sm uppercase tracking-widest">
                  PRO
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[8px] font-mono font-bold text-on-surface-variant/40 uppercase tracking-widest truncate">
                {session?.user?.email || 'Local Instance'}
              </p>
            </div>
          </div>

          {!isPro && (
             <div className="mb-2 px-1">
                <button 
                  onClick={handleUpgrade}
                  className="w-full flex items-center justify-between px-4 py-3 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] group"
                >
                   <div className="flex items-center gap-3">
                      <Crown size={16} fill="currentColor" strokeWidth={0} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Upgrade to Pro</span>
                   </div>
                </button>
             </div>
          )}

          <div className="space-y-0.5 px-1 pb-1" role="none">
            <button 
              onClick={() => handleAction(AppView.SETTINGS)}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-left group interactive"
            >
              <Settings size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Preferences</span>
            </button>

            <button 
              onClick={() => handleAction(AppView.HELP)}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-left group interactive"
            >
              <HelpCircle size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">The Manual</span>
            </button>
          </div>

          <div className="h-px bg-outline-variant/10 mx-3 my-1" />

          <div className="px-1 pb-1">
            <button 
              onClick={handleSignOut}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/5 transition-colors text-left group interactive"
            >
              <LogOut size={16} className="text-error opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-error opacity-80">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
