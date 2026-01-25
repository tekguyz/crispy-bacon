import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { AppView } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';
import { PRIMARY_NAV_ITEMS } from '../../../constants/navigation';

interface PrimaryNavListProps {
  isExpanded: boolean;
  onCloseMobile: () => void;
  onResetFilters: () => void;
}

export const PrimaryNavList: React.FC<PrimaryNavListProps> = ({
  isExpanded,
  onCloseMobile,
  onResetFilters
}) => {
  const { view, setView, activeCollectionFilterId } = useAppStore();

  const handleNavClick = (targetView: AppView) => {
    triggerHaptic('light');
    setView(targetView);
    onResetFilters();
    if (window.innerWidth < 768) onCloseMobile();
  };

  return (
    <nav className={`flex flex-col gap-2 ${!isExpanded ? 'items-center' : 'px-3'}`} aria-label="Primary navigation">
      {PRIMARY_NAV_ITEMS.map((item) => {
        const isActive = view === item.id && !activeCollectionFilterId;
        return (
          <Tooltip
            key={item.id}
            content={!isExpanded ? item.label : ""}
            side="right"
            className="w-full flex justify-center"
            disabled={isExpanded}
          >
            <button
              onClick={() => handleNavClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to ${item.label}`}
              className={`
                flex items-center h-11 transition-all duration-300 ease-spring relative interactive group outline-none
                ${isActive ? 'text-on-surface' : 'text-on-surface-variant/40 hover:text-on-surface hover:bg-on-surface/[0.04]'}
                ${!isExpanded ? 'w-full justify-center' : 'w-full px-4 rounded-xl'}
              `}
            >
              <div 
                className={`
                  absolute bg-primary transition-all duration-500 ease-spring z-0
                  ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  ${!isExpanded 
                    ? 'w-10 h-8 rounded-full left-1/2 -translate-x-1/2' 
                    : 'inset-0 rounded-xl'}
                `} 
              />
              
              <div className="relative z-10 flex items-center justify-center shrink-0 w-5 h-5">
                <item.icon size={18} strokeWidth={isActive ? 3 : 2} aria-hidden="true" />
              </div>
              
              {isExpanded && (
                <span className="relative z-10 ml-3 text-[12px] font-black uppercase tracking-tight sidebar-label-fade truncate">
                  {item.label}
                </span>
              )}
            </button>
          </Tooltip>
        );
      })}
    </nav>
  );
};