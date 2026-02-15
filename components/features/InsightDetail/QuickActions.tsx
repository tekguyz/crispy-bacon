
import React from 'react';
import { Star, Share2, Archive, Pin, PinOff } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { InsightContent } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';

interface QuickActionsProps {
  insight: InsightContent;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ insight }) => {
  const { toggleFavorite, toggleArchive, setShowShareModal } = useAppStore();

  const handlePin = () => {
    triggerHaptic('light');
    toggleFavorite(insight.id);
  };

  const handleArchive = () => {
    triggerHaptic('medium');
    toggleArchive(insight.id);
  };

  const handleShare = () => {
    triggerHaptic('light');
    setShowShareModal(true);
  };

  return (
    <div className="flex items-center justify-between p-1.5 bg-surface-container-low border border-outline-variant/10 rounded-2xl shadow-sm">
      <div className="flex gap-1">
        <Tooltip content={insight.is_favorite ? "Unpin Note" : "Pin Note"}>
            <button 
              onClick={handlePin}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90
                ${insight.is_favorite 
                  ? 'bg-primary text-on-primary shadow-lg ring-4 ring-primary/10' 
                  : 'text-on-surface-variant/40 hover:text-primary hover:bg-primary/5'}
              `}
            >
               {insight.is_favorite ? <Star size={18} fill="currentColor" strokeWidth={0} /> : <Star size={18} strokeWidth={2.5} />}
            </button>
        </Tooltip>

        <Tooltip content={insight.is_archived ? "Restore to History" : "Move to Archive"}>
            <button 
              onClick={handleArchive}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90
                ${insight.is_archived 
                  ? 'bg-on-surface text-surface shadow-lg' 
                  : 'text-on-surface-variant/40 hover:text-on-surface hover:bg-on-surface/5'}
              `}
            >
               <Archive size={18} strokeWidth={2.5} />
            </button>
        </Tooltip>
      </div>

      <Tooltip content="External Link">
        <button 
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 transition-all active:scale-90"
        >
          <Share2 size={18} strokeWidth={2.5} />
        </button>
      </Tooltip>
    </div>
  );
};
