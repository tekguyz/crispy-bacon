
import React from 'react';
import { X, MessageSquare, Info, Crown } from 'lucide-react';
import { Sentiment } from '../../../types';
import { GeminiLiveIcon } from '../../ui/Logo';
import { triggerHaptic } from '../../../services/hapticService';

interface DetailHeaderProps {
  title: string;
  sentiment: Sentiment;
  siteName?: string;
  isPro: boolean;
  isLiveAssistantActive: boolean;
  activeDrawer: string | null;
  onBack: () => void;
  onShare: () => void;
  onToggleDrawer: (tab: any) => void;
  onStartLive: () => void;
  onUpgrade: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  title, sentiment, siteName, isPro, isLiveAssistantActive, activeDrawer,
  onBack, onToggleDrawer, onStartLive, onUpgrade
}) => {
  return (
    // Increased height from h-14 to h-16 for better vertical stacking
    <div className="h-16 px-4 md:px-6 border-b border-outline-variant/10 bg-surface-container-low flex items-center justify-between gap-4 shrink-0 shadow-sm z-30">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button onClick={() => { triggerHaptic('light'); onBack(); }} className="w-9 h-9 flex items-center justify-center bg-background text-on-surface-variant hover:text-primary rounded-xl transition-all active:scale-90 shrink-0 border border-outline-variant/10 shadow-inner">
            <X size={16} strokeWidth={3} />
        </button>
        
        <div className="min-w-0 flex-1 flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-1.5 h-3.5">
             <span className={`text-[7px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ${sentiment === Sentiment.POSITIVE ? 'bg-success/10 text-success border border-success/10' : 'bg-surface-container-highest text-on-surface-variant opacity-40 border border-outline-variant/10'}`}>
                {sentiment}
             </span>
             {siteName && <p className="text-on-surface-variant text-[7px] font-mono font-extrabold uppercase tracking-widest opacity-20 truncate hidden md:block">{siteName}</p>}
           </div>
           <h2 className="text-xs font-black text-on-surface truncate tracking-tight font-sans leading-none uppercase">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 h-9">
          <button 
              onClick={() => { triggerHaptic('medium'); isPro ? onStartLive() : onUpgrade(); }}
              disabled={isLiveAssistantActive}
              className={`flex items-center gap-2.5 px-4 h-9 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest active:scale-95 ${isLiveAssistantActive ? 'bg-primary text-on-primary shadow-lg ring-1 ring-white/10' : (isPro ? 'bg-primary text-on-primary shadow-md' : 'bg-background text-on-surface-variant/60 border border-outline-variant/10')}`}
          >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <GeminiLiveIcon className={`w-full h-full aspect-square ${isLiveAssistantActive ? 'animate-pulse' : ''}`} />
              </div>
              <span className="hidden sm:inline">ASK</span>
              {!isPro && <Crown size={9} className="text-primary shrink-0" />}
          </button>

          <div className="w-px h-4 bg-outline-variant/20 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1">
              <button 
                onClick={() => { triggerHaptic('light'); onToggleDrawer('chat'); }} 
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent ${activeDrawer === 'chat' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                  <MessageSquare size={14} strokeWidth={activeDrawer === 'chat' ? 3 : 2} />
              </button>

              <button 
                onClick={() => { triggerHaptic('light'); onToggleDrawer('info'); }} 
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent ${activeDrawer === 'info' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                  <Info size={14} strokeWidth={activeDrawer === 'info' ? 3 : 2} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default DetailHeader;
