import React from 'react';
import { Star, Share2, Archive } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../services/hapticService';
import { InsightContent } from '../../../types';

interface QuickActionsProps {
  insight: InsightContent;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ insight }) => {
  const { toggleFavorite, toggleArchive, setShowShareModal } = useAppStore();

  const ActionBtn = ({ onClick, active, icon: Icon, label, activeColor = 'text-primary' }: any) => (
    <button 
      onClick={onClick}
      className={`
        flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border transition-all active:scale-95 group
        ${active 
          ? `bg-surface border-primary/40 ${activeColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]` 
          : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-primary/20 hover:text-on-surface'}
      `}
    >
      <Icon size={18} fill={active ? "currentColor" : "none"} strokeWidth={active ? 3 : 2} className={active ? 'animate-spring-scale' : 'opacity-40 group-hover:opacity-100'} />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex gap-2">
      <ActionBtn 
        onClick={() => { triggerHaptic('light'); toggleFavorite(insight.id); }}
        active={insight.is_favorite}
        icon={Star}
        label={insight.is_favorite ? "Pinned" : "Pin"}
      />
      
      <ActionBtn 
        onClick={() => { triggerHaptic('light'); setShowShareModal(true); }}
        active={false}
        icon={Share2}
        label="Share"
      />

      <ActionBtn 
        onClick={() => { triggerHaptic('medium'); toggleArchive(insight.id); }}
        active={insight.is_archived}
        icon={Archive}
        label={insight.is_archived ? "Archived" : "Archive"}
        activeColor="text-on-surface"
      />
    </div>
  );
};