
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useLiveSession } from '../../hooks/useLiveSession';
import { X, Mic, Loader2, Volume2, WifiOff, Clock } from 'lucide-react';
import { GeminiLiveIcon } from '../ui/Logo';

const HorizontalWaveform = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center w-full h-8 relative px-2">
    <div className="w-full h-px bg-on-surface-variant/5 absolute top-1/2 left-0 -translate-y-1/2" />
    <div className="flex items-center justify-between w-full h-full relative z-10">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            isActive ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-on-surface-variant/10 h-0.5'
          }`}
          style={{
            height: isActive ? `${Math.max(3, Math.random() * 20)}px` : '2px',
            opacity: isActive ? (0.6 + Math.random() * 0.4) : 0.05,
            transitionDelay: `${i * 30}ms`
          }}
        />
      ))}
    </div>
  </div>
);

const LiveAssistantSession: React.FC = () => {
  const { isLiveAssistantActive, stopLiveAssistant } = useAppStore();
  const { status, volumeLevel, isSpeaking, timeToAutoKill } = useLiveSession();

  if (!isLiveAssistantActive) return null;

  return (
    <section className="fixed inset-x-0 bottom-4 md:bottom-10 z-[300] flex justify-center px-4 animate-slide-up pointer-events-none">
      <div className={`bg-surface-container-highest/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.4)] border-2 rounded-[2.5rem] p-2 pr-5 md:pr-6 flex items-center gap-4 md:gap-6 pointer-events-auto w-full max-w-[480px] relative overflow-hidden h-20 md:h-24 transition-all duration-500 ${status === 'connected' ? 'border-primary/30 ring-1 ring-primary/20' : 'border-outline-variant/20'}`}>
        
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.75rem] flex items-center justify-center shrink-0 transition-all duration-700 shadow-2xl ${status === 'connected' ? 'bg-primary text-on-primary scale-100' : 'bg-surface-container-high text-on-surface-variant/30 scale-90'}`}>
            {status === 'connecting' && <Loader2 size={24} className="animate-spin" />}
            {status === 'connected' && (
              <div className="w-8 h-8 shrink-0">
                <GeminiLiveIcon className={`w-full h-full aspect-square ${volumeLevel > 0.05 ? 'animate-pulse' : ''}`} />
              </div>
            )}
            {status === 'error' && <WifiOff size={24} />}
            {status === 'idle' && <Loader2 size={24} className="animate-spin opacity-40" />}
        </div>

        <div className="flex-1 flex flex-col justify-center min-w-0">
            {status === 'connecting' ? (
                <div className="flex flex-col gap-2 px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Initializing...</span>
                    <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-1000" style={{ width: '40%' }} />
                    </div>
                </div>
            ) : status === 'error' ? (
                <div className="flex flex-col gap-1 px-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-error">Link Deferred</span>
                    <span className="text-[7px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Hardware Blocked</span>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-on-surface leading-none">ASK VOICE</span>
                        </div>
                        {timeToAutoKill ? (
                            <span className="text-[8px] font-black text-primary animate-pulse flex items-center gap-1.5 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
                                <Clock size={10} /> Auto-close: {timeToAutoKill}s
                            </span>
                        ) : (
                            isSpeaking && <Volume2 size={12} className="text-primary animate-pulse opacity-60" />
                        )}
                    </div>
                    <HorizontalWaveform isActive={isSpeaking || volumeLevel > 0.02} />
                </div>
            )}
        </div>

        <button 
            onClick={stopLiveAssistant}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-all flex items-center justify-center shadow-inner shrink-0 active:scale-90 border border-outline-variant/10"
            aria-label="Terminate Ask Voice"
        >
            <X size={22} strokeWidth={3} />
        </button>
      </div>
    </section>
  );
};

export default LiveAssistantSession;
