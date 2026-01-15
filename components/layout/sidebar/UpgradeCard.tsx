
import React from 'react';
import { Crown, Zap, Check } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { Tooltip } from '../../ui/Tooltip';

interface UpgradeCardProps {
  isExpanded: boolean;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({ isExpanded }) => {
  const { setShowUpgradeModal, userProfile } = useAppStore();
  const isPro = !!userProfile?.is_pro;

  const handleUpgrade = () => {
    if (isPro) return;
    triggerHaptic('medium');
    setShowUpgradeModal(true);
  };

  // Strategic Hallmark Styles (Metallic Bronze/Gold) - Adjusted for OKLCH theme consistency
  const hallmarkBg = "bg-amber-500/10 dark:bg-amber-400/10";
  const hallmarkText = "text-amber-700 dark:text-amber-400";
  const hallmarkBorder = "border-amber-500/20 dark:border-amber-400/20";

  if (isPro) {
    return (
      <div className={`w-full flex justify-center ${isExpanded ? 'px-3' : ''}`}>
        <Tooltip content={!isExpanded ? "Executive Member" : ""} side="right" disabled={isExpanded}>
          <div
            className={`
              flex items-center transition-all group relative overflow-hidden
              ${!isExpanded 
                ? `w-10 h-10 rounded-full justify-center ${hallmarkBg} ${hallmarkText} border ${hallmarkBorder} shadow-inner` 
                : 'w-full bg-surface-container-high border border-outline-variant/10 rounded-2xl h-14 px-4 text-left shadow-sm sidebar-label-fade'}
            `}
          >
            <div className={`relative z-10 flex items-center ${isExpanded ? 'gap-3' : 'justify-center w-full'}`}>
              <div className={isExpanded ? `p-1.5 ${hallmarkBg} ${hallmarkText} rounded-lg border ${hallmarkBorder}` : ""}>
                <Crown size={!isExpanded ? 14 : 16} strokeWidth={0} fill="currentColor" className={!isExpanded ? "" : "shrink-0"} />
              </div>
              
              {isExpanded && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest truncate leading-tight text-on-surface">Executive Tier</span>
                  <div className="flex items-center gap-1 opacity-60">
                    <Check size={8} strokeWidth={4} className="text-amber-600 dark:text-amber-500" />
                    <span className="text-[7px] font-bold uppercase tracking-widest truncate text-on-surface-variant">Identity Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center ${isExpanded ? 'px-3' : ''}`}>
      <Tooltip content={!isExpanded ? "Upgrade Account" : ""} side="right" disabled={isExpanded}>
        <button
          onClick={handleUpgrade}
          className={`
            flex items-center transition-all interactive group relative overflow-hidden
            ${!isExpanded 
              ? 'w-10 h-10 rounded-full justify-center bg-primary text-on-primary shadow-lg shadow-primary/20' 
              : 'w-full bg-primary text-on-primary rounded-2xl h-14 px-4 text-left shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] sidebar-label-fade'}
          `}
        >
          <div className={`relative z-10 flex items-center ${isExpanded ? 'gap-3' : 'justify-center w-full'}`}>
            <Crown size={!isExpanded ? 14 : 18} strokeWidth={3} className={!isExpanded ? "group-hover:scale-110 transition-transform" : "animate-pulse shrink-0"} />
            
            {isExpanded && (
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest truncate leading-tight">Unlock Pro</span>
                <span className="text-[7px] font-bold opacity-70 uppercase tracking-widest truncate">Strategic Access</span>
              </div>
            )}
          </div>

          {isExpanded && (
             <Zap size={48} className="absolute -right-4 -bottom-4 opacity-10 text-white rotate-12" />
          )}
        </button>
      </Tooltip>
    </div>
  );
};
