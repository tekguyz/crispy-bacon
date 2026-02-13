
import React from 'react';
import { Radio } from 'lucide-react';

interface AudioSourceProps {
  url: string;
  title?: string;
  variant?: 'primary' | 'slim';
}

export const AudioSource: React.FC<AudioSourceProps> = ({ url, title, variant = 'primary' }) => {
  return (
    <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-2 flex items-center gap-3 animate-fade-in shadow-sm group">
      <div className="w-8 h-8 bg-surface-container-highest text-primary rounded-lg flex items-center justify-center shrink-0 border border-outline-variant/10 group-hover:border-primary/20 transition-colors">
        <Radio size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center h-8">
         {/* Custom styled audio element */}
         <audio 
            controls 
            src={url} 
            className="w-full h-6 accent-primary custom-audio-player-drawer scale-[1.02] origin-left" 
            title={title || "Audio Recording"}
         />
      </div>

      <style>{`
        .custom-audio-player-drawer::-webkit-media-controls-panel {
          background-color: transparent;
          padding-left: 0;
        }
        .custom-audio-player-drawer::-webkit-media-controls-enclosure {
          background-color: transparent;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};
