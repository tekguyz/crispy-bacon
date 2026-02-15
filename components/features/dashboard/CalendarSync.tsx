
import React, { useState, useEffect } from 'react';
import { RefreshCw, Video, Zap, ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock, Cpu, Target } from 'lucide-react';
import { CalendarEvent } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

interface CalendarSyncProps {
  isLoading: boolean;
  isPro: boolean;
  meetings: CalendarEvent[];
  onRefresh: () => void;
  onReauth: () => void;
  onPrepare: (meeting: CalendarEvent) => void;
  onUpgrade: () => void;
}

const CalendarSync: React.FC<CalendarSyncProps> = ({ 
  isLoading, isPro, meetings, onRefresh, onReauth, onPrepare, onUpgrade 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { session, currentIntent, setCurrentIntent } = useAppStore();
  
  const providerToken = (session as any)?.provider_token;
  const isGoogleLinked = session?.user?.app_metadata?.provider === 'google';

  const nextMeeting = meetings[activeIndex] || null;
  const hasMultiple = meetings.length > 1;

  useEffect(() => {
    if (meetings.length > 0 && activeIndex >= meetings.length) {
      setActiveIndex(0);
    }
  }, [meetings.length, activeIndex]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? meetings.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === meetings.length - 1 ? 0 : prev + 1));
  };

  const CardHeader = ({ label, icon: Icon, color = "text-primary" }: any) => (
    <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 bg-surface-container-high ${color} rounded-lg border border-outline-variant/10 shadow-inner`}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{label}</h3>
      </div>
      {isGoogleLinked && (
        <button onClick={onRefresh} className="p-1.5 hover:bg-surface-container-highest rounded-lg text-on-surface-variant/40 hover:text-primary transition-all active:rotate-180">
          <RefreshCw size={16} strokeWidth={2.5} className={isLoading ? "animate-spin" : ""} />
        </button>
      )}
    </div>
  );

  // FALLBACK: Manual Focus for Non-Google Users
  if (!isGoogleLinked) {
     return (
      <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-expressive shadow-sm flex flex-col relative overflow-hidden transition-all duration-500 min-h-[340px]">
        <div className="absolute inset-0 ledger-grid opacity-10 pointer-events-none" />
        <CardHeader label="Quick Note" icon={Target} color="text-primary" />
        
        <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
          <p className="text-xl font-slab font-bold text-on-surface uppercase tracking-tight leading-none">Set a <br/>Goal.</p>
          
          <div className="space-y-2 mt-2">
            <label className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 px-1">Focus</label>
            <textarea 
              value={currentIntent}
              onChange={(e) => setCurrentIntent(e.target.value)}
              placeholder="What is the goal of this note?"
              className="w-full bg-surface-container-high border-2 border-outline-variant/10 rounded-2xl p-4 text-xs font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner resize-none min-h-[100px] placeholder:text-on-surface-variant/20"
            />
          </div>

          <p className="text-[8px] font-bold text-on-surface-variant opacity-30 uppercase tracking-[0.2em] mt-auto">
            Microsoft 365 Support arriving in future updates.
          </p>
        </div>
      </div>
     );
  }

  // Pro Gating
  if (!isPro) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-expressive shadow-sm flex flex-col relative overflow-hidden group/pro hover:shadow-lg transition-all duration-500 min-h-[340px]">
        <div className="absolute inset-0 ledger-grid opacity-10 pointer-events-none" />
        <CardHeader label="Calendar" icon={Calendar} color="text-primary" />
        
        <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
          <div className="space-y-3">
             <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-primary text-on-primary rounded font-black text-[7px] uppercase tracking-widest shadow-sm">PRO FEATURE</span>
             </div>
             <p className="text-xl font-slab font-bold text-on-surface uppercase tracking-tight leading-tight">Link Your <br/>Schedule.</p>
             <p className="text-[10px] font-bold text-on-surface-variant opacity-50 leading-relaxed max-w-[200px]">
               Link your calendar to see upcoming meetings and prepare for them instantly.
             </p>
          </div>
          <button 
            onClick={onUpgrade}
            className="w-full py-5 bg-on-surface text-surface rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/5 active:scale-95 group/btn"
          >
            Link Schedule <ArrowRight size={18} strokeWidth={2} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Graceful Syncing / Bridge Recovery
  if (isLoading || !providerToken) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-expressive shadow-sm flex flex-col items-center justify-center gap-6 animate-fade-in relative min-h-[340px] overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-10 pointer-events-none" />
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <Cpu size={40} className="text-primary animate-spin-slow relative z-10" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface animate-pulse">
                {!providerToken ? "Reconnecting" : "Checking Agenda"}
            </p>
            <p className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
                Connecting...
            </p>
            <button onClick={onReauth} className="text-[7px] font-black uppercase text-primary hover:underline">Check Now</button>
        </div>
      </div>
    );
  }

  // Schedule Empty
  if (meetings.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-expressive shadow-sm flex flex-col relative overflow-hidden group/agenda hover:shadow-lg transition-all min-h-[340px]">
        <div className="absolute inset-0 ledger-grid opacity-10 pointer-events-none" />
        <CardHeader label="Calendar" icon={Calendar} />
        
        <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success/5 border border-success/20 flex items-center justify-center text-success shrink-0 shadow-inner group-hover/agenda:animate-pulse">
                 <Zap size={32} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-slab font-bold text-on-surface uppercase tracking-tight leading-none">Schedule Clear.</h4>
                 <p className="text-[9px] font-black text-success uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={12} strokeWidth={2} /> Calendar Connected
                 </p>
              </div>
           </div>
           <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest leading-relaxed">
             No upcoming meetings found for the next 24 hours. Enjoy the clarity.
           </p>
        </div>
      </div>
    );
  }

  // Active Agenda
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-expressive shadow-sm flex flex-col relative overflow-hidden group/active animate-fade-in min-h-[340px]">
      <div className="absolute inset-0 ledger-grid opacity-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary text-on-primary rounded-lg shadow-lg shadow-primary/20">
            <Zap size={24} strokeWidth={2} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Up Next</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {hasMultiple && (
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-xl border border-outline-variant/10 shadow-inner">
               <button onClick={handlePrev} className="p-1 hover:text-primary transition-colors active:scale-75"><ChevronLeft size={16} strokeWidth={3} /></button>
               <span className="text-[8px] font-mono font-black text-on-surface-variant uppercase tracking-tighter w-8 text-center">{activeIndex + 1}/{meetings.length}</span>
               <button onClick={handleNext} className="p-1 hover:text-primary transition-colors active:scale-75"><ChevronRight size={16} strokeWidth={3} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-8 relative z-10 animate-spring-up" key={nextMeeting.id}>
        <div className="space-y-6">
          <div className="flex gap-5 items-start">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center shrink-0 shadow-inner">
              <Video size={32} strokeWidth={1.5} className="text-primary/60" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded tracking-widest leading-none border border-primary/10 shadow-sm">
                  {new Date(nextMeeting.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest leading-none">Starting soon</span>
              </div>
              <h4 className="text-xl font-slab font-bold text-on-surface leading-tight uppercase tracking-tight line-clamp-2">{nextMeeting.summary}</h4>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onPrepare(nextMeeting)} 
          className="w-full py-5 bg-on-surface text-surface rounded-[1.5rem] shadow-xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98] group/prep"
        >
          Create Note <ArrowRight size={20} strokeWidth={2} className="inline ml-2 group-hover/prep:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CalendarSync);
