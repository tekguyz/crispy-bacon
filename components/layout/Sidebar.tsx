
import React from 'react';
import { Menu, X } from 'lucide-react';
import { PrimaryNavList } from './sidebar/PrimaryNavList';
import { CollectionVault } from './sidebar/CollectionVault';
import { useAppStore } from '../../store/useAppStore';
import { triggerHaptic } from '../../services/hapticService';
import { UserAccountPopover } from '../UserAccountPopover';

interface SidebarProps {
  isExpanded: boolean;
  onToggleExpansion: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onResetFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isExpanded, 
  onToggleExpansion, 
  isMobileOpen, 
  onCloseMobile, 
  onResetFilters 
}) => {
  const { userProfile } = useAppStore();
  const isPro = !!userProfile?.is_pro;

  const handleToggle = () => {
    triggerHaptic('light');
    onToggleExpansion();
  };

  const SidebarContent = (isMobile: boolean) => (
    <div className={`flex flex-col h-full ${isMobile ? 'py-4' : 'pt-8 pb-4'} items-stretch`}>
      {/* Brand Anchor */}
      {!isMobile && (
        <div className={`mb-8 flex shrink-0 items-center ${!isExpanded ? 'justify-center' : 'pl-6 pr-4 justify-between'}`}>
          {isExpanded && (
            <div className="sidebar-label-fade flex-1 flex items-center gap-2">
              <span className="font-black text-lg tracking-tighter uppercase leading-none truncate text-on-surface">
                Crispy <span className="text-primary">Bacon</span>
              </span>
              {isPro && (
                <span className="px-1.5 py-0.5 rounded-md bg-primary text-on-primary text-[8px] font-black uppercase tracking-wider shadow-sm">
                  PRO
                </span>
              )}
            </div>
          )}
          <button 
            onClick={handleToggle}
            className={`flex items-center justify-center rounded-xl hover:bg-on-surface/10 text-on-surface transition-colors interactive ${!isExpanded ? 'w-10 h-10' : 'w-8 h-8'}`}
            aria-label={isExpanded ? "Collapse navigation menu" : "Expand navigation menu"}
            aria-expanded={isExpanded}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Navigation Stack */}
      <nav className={`flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar ${isMobile ? 'px-4' : ''}`} aria-label="Main navigation">
        <PrimaryNavList 
          isExpanded={isExpanded || isMobile} 
          onCloseMobile={onCloseMobile} 
          onResetFilters={onResetFilters} 
        />
        
        <div className={`h-px bg-outline-variant/10 my-2 ${isExpanded ? 'mx-6' : 'mx-4'}`} aria-hidden="true" />

        <CollectionVault 
          isExpanded={isExpanded || isMobile} 
          onCloseMobile={onCloseMobile} 
        />
      </nav>

      {/* User Profile at Bottom */}
      <div className={`mt-auto pt-4 ${isMobile ? 'px-4' : ''}`}>
         <UserAccountPopover isExpanded={isExpanded || isMobile} />
      </div>
    </div>
  );

  return (
    <>
      <aside 
        className={`
          hidden md:flex flex-col nav-rail transition-all duration-500 ease-spring shrink-0 h-screen sticky top-0 z-50
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
        role="navigation"
        aria-label="Desktop Sidebar"
      >
        {SidebarContent(false)}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} aria-hidden="true" />
          <div 
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] bg-background border-t border-outline-variant mobile-nav-drawer animate-sheet-up overflow-hidden flex flex-col shadow-2xl rounded-t-[2.5rem]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="flex justify-center pt-3 pb-2 shrink-0">
               <div className="h-1 w-12 bg-on-surface/20 rounded-full" aria-hidden="true" />
            </div>
            
            <div className="flex items-center justify-between px-6 py-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-on-surface">Menu</span>
              <button onClick={onCloseMobile} className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface transition-colors" aria-label="Close navigation"><X size={20} /></button>
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
               {SidebarContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
