
import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';

interface AudioSourceProps {
  url: string;
  title?: string;
  variant?: 'primary' | 'slim';
}

export const AudioSource: React.FC<AudioSourceProps> = ({ url, title, variant = 'primary' }) => {
  if (variant === 'slim') {
    return (
      <div className="bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl p-2 flex items-center gap-3 animate-fade-in mb-6">
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
          <Radio size={14} className="animate-pulse" />
        </div>
        <audio 
          controls 
          src={url} 
          className="flex-1 h-8 accent-primary custom-audio-player-slim" 
        />
        <style>{`.custom-audio-player-slim::-webkit-media-controls-enclosure { border-radius: 8px; }`}</style>
      </div>
    );
  }

  return (
    <section className="space-y-3 mb-8 group/signal animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 text-primary rounded-md shadow-inner">
            <Radio size={12} strokeWidth={3} className="animate-pulse" />
          </div>
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">Reference Audio</h4>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-success/5 border border-success/10 rounded-md">
           <ShieldCheck size={8} className="text-success" />
           <span className="text-[7px] font-mono font-black text-success uppercase tracking-widest">Verified Signal</span>
        </div>
      </div>
      <div className="bg-surface-container-highest border border-outline-variant/30 rounded-[1.5rem] p-3 shadow-xl ring-1 ring-black/5 group-hover/signal:border-primary/50 transition-all duration-500">
        <audio 
          controls 
          src={url} 
          className="w-full h-10 accent-primary custom-audio-player" 
          aria-label="Source audio playback"
        />
      </div>
    </section>
  );
};
