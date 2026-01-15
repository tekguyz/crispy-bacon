import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

interface PocketShieldProps {
  onUnlock: () => void;
  isRecording: boolean;
}

export const PocketShield: React.FC<PocketShieldProps> = ({ onUnlock, isRecording }) => {
  const [progress, setProgress] = useState(0);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isPressing, setIsPressing] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const UNLOCK_DURATION = 2000;

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setTouchPos({ x: clientX, y: clientY });
    setIsPressing(true);
    setProgress(0);

    const startTime = Date.now();
    
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / UNLOCK_DURATION) * 100);
      setProgress(p);
    }, 16);

    timerRef.current = window.setTimeout(() => {
      triggerHaptic('heavy');
      onUnlock();
      handleEnd();
    }, UNLOCK_DURATION);
  };

  const handleEnd = useCallback(() => {
    setIsPressing(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  useEffect(() => {
    if (!isRecording) onUnlock();
    return () => handleEnd();
  }, [isRecording, onUnlock, handleEnd]);

  return (
    <div 
      className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none touch-none animate-fade-in"
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }} 
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd} 
      onTouchMove={(e) => {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        // v1.6.8: Increased forgiving drift threshold from 80 to 120 for thumb roll
        const dist = Math.sqrt(Math.pow(clientX - touchPos.x, 2) + Math.pow(clientY - touchPos.y, 2));
        if (dist > 120) handleEnd();
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className="text-center space-y-6 opacity-20 pointer-events-none">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto">
          <Lock size={24} className="text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Pocket Mode Active</p>
          <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Hold screen to unlock</p>
        </div>
      </div>

      {isPressing && (
        <div 
          className="absolute pointer-events-none"
          style={{ left: touchPos.x - 40, top: touchPos.y - 40 }}
        >
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * progress) / 100}
              className="opacity-40"
            />
          </svg>
        </div>
      )}
    </div>
  );
};