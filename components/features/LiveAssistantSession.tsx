
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useLiveSession } from '../../hooks/useLiveSession';
import { X, Mic, Loader2, Volume2, WifiOff, Clock, Power } from 'lucide-react';
import { GeminiLiveIcon } from '../ui/Logo';

const SignalPulse = ({ isActive, volume }: { isActive: boolean, volume: number }) => {
  const scale = 1 + (volume * 1.5);
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Outer Halo */}
      <div 
        className={`absolute inset-0 rounded-full border border-primary/20 transition-transform duration-75 ease-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: `scale(${scale * 1.4})` }}
      />
      {/* Inner Halo */}
      <div 
        className={`absolute inset-0 rounded-full border-2 border-primary/40 transition-transform duration-100 ease-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: `scale(${scale * 1.1})` }}
      />
      {/* Core */}
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant/20'}`}>
         {isActive ? (
           <GeminiLiveIcon className="w-5 h-5 animate-pulse" />
         ) : (
           <Mic size={18} strokeWidth={2.5} />
         )}
      </div>
    </div>
  );
};

const LiveAssistantSession: React.FC = () => {
  const { isLiveAssistantActive, stopLiveAssistant } = useAppStore();
  const { status, volumeLevel, isSpeaking, timeToAutoKill } = useLiveSession();

  if (!isLiveAssistantActive) return null;

  const isConnected = status === 'connected';

  return (
    <section className="fixed inset-x-0 bottom-8 z-[300] flex justify-center px-4 pointer-events-none animate-slide-up">
      <div className={`
        pointer-events-auto bg-surface-container-highest/90 backdrop-blur-2xl 
        border border-outline-variant/20 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)]
        flex items-center p-1.5 pr-4 gap-4 transition-all duration-700 ease-spring
        ${isConnected ? 'w-full max-w-[320px] border-primary/20 ring-1 ring-primary/10' : 'w-[200px] grayscale'}
      `}>
        
        {/* THE CORE PULSE */}
        <div className="shrink-0 ml-1">
          <SignalPulse isActive={isConnected && (isSpeaking || volumeLevel > 0.05)} volume={volumeLevel} />
        </div>

        {/* STATUS & INTEL LAYER */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {status === 'connecting' ? (
            <div className="flex flex-col gap-1 px-1">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Connecting...</span>
              <div className="h-0.5 w-16 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="flex items-center gap-2 px-1">
              <WifiOff size={12} className="text-error" />
              <span className="text-[8px] font-black uppercase tracking-widest text-error">No Link</span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 px-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-black text-on-surface uppercase tracking-[0.3em]">
                  {isSpeaking ? 'Speaking' : 'Listening...'}
                </span>
                {timeToAutoKill && (
                  <span className="text-[7px] font-black text-primary uppercase tabular-nums">
                    {timeToAutoKill}s
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 opacity-40">
                 <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-on-surface-variant'}`} />
                 <span className="text-[7px] font-black uppercase tracking-[0.2em] truncate">Assistant Active</span>
              </div>
            </div>
          )}
        </div>

        {/* KILL SWITCH */}
        <button 
          onClick={stopLiveAssistant}
          className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/5 transition-all group active:scale-90"
          aria-label="End Session"
        >
          <Power size={14} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default LiveAssistantSession;
