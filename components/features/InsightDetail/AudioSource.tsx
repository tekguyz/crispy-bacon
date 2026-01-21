
import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';

interface AudioSourceProps {
  url: string;
  title?: string;
  variant?: 'primary' | 'slim';
}

export const AudioSource: React.FC<AudioSourceProps> = ({ url, title, variant = 'primary' }) => {
  return (
    <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-2.5 flex items-center gap-3 animate-fade-in shadow-inner">
      <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
        <Radio size={16} strokeWidth={2.5} className="animate-pulse" />
      </div>
      <audio 
        controls 
        src={url} 
        className="flex-1 h-8 accent-primary custom-audio-player-drawer" 
      />
      <style>{`
        .custom-audio-player-drawer::-webkit-media-controls-panel {
          background-color: var(--md-sys-color-surface-container-high);
        }
        .custom-audio-player-drawer::-webkit-media-controls-enclosure {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
