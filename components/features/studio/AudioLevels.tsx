
import React, { useEffect, useRef } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

interface AudioLevelsProps {
  stream: MediaStream | null;
  isRecording: boolean;
  isPaused: boolean;
  elapsedTime: number;
  limit?: number;
}

export const AudioLevels: React.FC<AudioLevelsProps> = ({ 
  stream, isRecording, isPaused, elapsedTime, limit = 900
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, limit - elapsedTime);
  const isWarningZone = remaining <= 60; // 1 minute left
  const isDangerZone = remaining <= 10; // 10 seconds left

  useEffect(() => {
    if (!stream || !isRecording || isPaused) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512; 
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = isDangerZone ? 'oklch(0.50 0.22 25)' : (isWarningZone ? 'oklch(0.62 0.21 45)' : 'oklch(0.68 0.19 45)');
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioCtx.close();
    };
  }, [stream, isRecording, isPaused, isWarningZone, isDangerZone]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
           <Activity size={12} className={isDangerZone ? 'text-error animate-pulse' : 'text-primary'} />
           <span className={`text-[9px] font-black uppercase tracking-widest ${isDangerZone ? 'text-error' : 'text-on-surface-variant'}`}>
             {isDangerZone ? 'Finalizing Signal' : 'Live Signal'}
           </span>
        </div>
        
        <div className="flex flex-col items-end leading-none">
          <span className={`text-[10px] font-mono font-black tabular-nums transition-colors duration-500 ${isPaused ? 'text-on-surface-variant opacity-30' : (isDangerZone ? 'text-error' : (isWarningZone ? 'text-primary' : 'text-on-surface'))}`}>
             {formatTime(elapsedTime)}
          </span>
          {isWarningZone && !isPaused && (
            <span className={`text-[7px] font-black uppercase tracking-widest animate-pulse mt-1 ${isDangerZone ? 'text-error' : 'text-primary'}`}>
              -{formatTime(remaining)}
            </span>
          )}
        </div>
      </div>

      <div className={`h-10 w-full relative bg-surface-container-high rounded-xl overflow-hidden border transition-all duration-500 shadow-inner ${isDangerZone ? 'border-error/40' : 'border-outline-variant/10'}`}>
        <canvas ref={canvasRef} width={240} height={40} className="w-full h-full opacity-60" />
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high/40 backdrop-blur-[1px]">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-on-surface-variant">Signal Holding</span>
          </div>
        )}
      </div>
    </div>
  );
};
