
import React from 'react';

interface StudioTimerProps {
  elapsedTime: number;
  isRecording: boolean;
  isPaused: boolean;
}

export const StudioTimer: React.FC<StudioTimerProps> = ({ 
  elapsedTime, isRecording, isPaused
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] font-mono font-black tracking-widest tabular-nums ${isPaused ? 'text-on-surface-variant opacity-40' : 'text-primary'}`}>
        {formatTime(elapsedTime)}
      </span>
      {isPaused && <span className="text-[8px] font-black uppercase tracking-widest text-warning px-1.5 py-0.5 bg-warning/10 rounded">Paused</span>}
    </div>
  );
};
