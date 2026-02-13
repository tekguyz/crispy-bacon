
import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppView } from '../../types';
import { triggerHaptic } from '../../services/hapticService';

export const UserAccountPopover: React.FC = () => {
  const { session, userProfile, signOut, setView } = useAppStore();
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

  const avatarUrl = session?.user?.user_metadata?.picture || userProfile?.avatar_url;
  const isPro = !!userProfile?.is_pro;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => { triggerHaptic('light'); setIsOpen(!isOpen); }}
        className="w-10 h-10 rounded-full border-2 border-outline-variant/10 overflow-hidden bg-surface-container-high hover:border-primary/40 transition-all active:scale-90 interactive shrink-0 flex items-center justify-center shadow-sm"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
            <UserIcon size={20} strokeWidth={2.5} />
          </div>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-72 bg-surface border border-outline rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-2 z-[100] animate-spring-up origin-top-right ring-1 ring-black/10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-6 py-6 mb-2 bg-surface-container-low rounded-t-[1.75rem] border-b border-outline-variant/10">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-sm font-black uppercase tracking-tight text-on-surface truncate">
                {userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User'}
              </p>
              {isPro && (
                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary text-on-primary shadow-sm uppercase tracking-widest">
                  PRO
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-mono font-bold text-on-surface-variant/40 uppercase tracking-widest truncate">
                {session?.user?.email || 'Local Instance'}
              </p>
              <div className="flex items-center gap-1.5 opacity-30 mt-1">
                <ShieldCheck size={10} className="text-success" />
                <span className="text-[7px] font-black uppercase tracking-widest">Private</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 px-1 pb-1" role="none">
            <button 
              onClick={() => handleAction(AppView.SETTINGS)}
              role="menuitem"
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-on-surface/[0.04] transition-colors text-left group interactive"
            >
              <Settings size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-widest text-on-surface">Preferences</span>
            </button>

            <button 
              onClick={() => handleAction(AppView.HELP)}
              role="menuitem"
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-on-surface/[0.04] transition-colors text-left group interactive"
            >
              <HelpCircle size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-widest text-on-surface">The Manual</span>
            </button>
          </div>

          <div className="h-px bg-outline-variant/10 mx-4 my-2" />

          <div className="px-1 pb-1">
            <button 
              onClick={handleSignOut}
              role="menuitem"
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-error/5 transition-colors text-left group interactive"
            >
              <LogOut size={18} className="text-error opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-widest text-error opacity-80">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
