
import React from 'react';
import { Brain, Zap, CheckCircle2, Archive, ShieldCheck, Clock, Gauge, Mic, Layers, Lock } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { InsightTemplate, PersonaStyle } from '../../../types';

export const SmartConfigSection: React.FC = () => {
  const { 
    preferredVoice, setPreferredVoice, 
    preferredTemplate, setPreferredTemplate, 
    personaStyle, setPersonaStyle,
    voiceSpeed, setVoiceSpeed,
    userProfile, addToast
  } = useAppStore();

  const isPro = !!userProfile?.is_pro;
  const voices = ['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'] as const;

  const labels: Record<InsightTemplate, string> = {
    [InsightTemplate.EXECUTIVE]: 'Executive Brief',
    [InsightTemplate.PRODUCT]: 'Product Discovery',
    [InsightTemplate.ENGINEERING]: 'Technical Review',
    [InsightTemplate.STAKEHOLDER]: 'Stakeholder Sync'
  };
  
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 md:p-8 space-y-8 shadow-sm">
        
        {/* TOP ROW: VOICE & TEMPLATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* COLUMN 1: VOICE CONFIG */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/5">
                    <Mic size={14} className="text-primary" strokeWidth={2.5} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Assistant Voice</h3>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {voices.map(v => (
                            <button 
                            key={v}
                            onClick={() => setPreferredVoice(v)}
                            className={`h-9 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${preferredVoice === v ? 'bg-primary border-primary text-on-primary shadow-md' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between px-1">
                            <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Rate</span>
                            <span className="text-[8px] font-mono font-bold text-primary">{voiceSpeed}x</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.8" 
                            max="1.5" 
                            step="0.1" 
                            value={voiceSpeed} 
                            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* COLUMN 2: REASONING ENGINE */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/5">
                    <Brain size={14} className="text-primary" strokeWidth={2.5} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">AI Model</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-1">Summary Style</label>
                        <div className="grid grid-cols-1 gap-1.5">
                            {Object.values(InsightTemplate).map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setPreferredTemplate(t)}
                                    className={`flex items-center justify-between h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${preferredTemplate === t ? 'bg-surface-container-high border-primary/30 text-primary shadow-sm' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant opacity-60 hover:opacity-100 hover:border-primary/20'}`}
                                >
                                    <span>{labels[t]}</span>
                                    {preferredTemplate === t && <CheckCircle2 size={12} className="text-primary" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex p-1 bg-surface-container border border-outline-variant/10 rounded-xl gap-1">
                        <button
                            onClick={() => setPersonaStyle(PersonaStyle.CONCISE)}
                            className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${personaStyle === PersonaStyle.CONCISE ? 'bg-background text-on-surface shadow-sm' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                        >
                            Quick Recap
                        </button>
                        <button
                            onClick={() => isPro ? setPersonaStyle(PersonaStyle.DEEP_RESEARCH) : null}
                            className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${personaStyle === PersonaStyle.DEEP_RESEARCH ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant/40 hover:text-on-surface'} ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Deep Strategy
                            {!isPro && <Lock size={8} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM ROW: RETENTION */}
        <div className="pt-6 border-t border-outline-variant/10">
            <div className="flex items-center justify-between px-1 mb-4">
                <div className="flex items-center gap-2">
                    <Archive size={14} className="text-primary" strokeWidth={2.5} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Retention Policy</h3>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <button 
                 onClick={() => addToast("Standard retention policy.", "info")}
                 className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${!isPro ? 'bg-surface-container-high border-primary text-on-surface' : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant opacity-60'}`}
               >
                  <div className="flex items-center gap-3">
                     <Clock size={16} />
                     <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest">30-Day History</span>
                        <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Auto-Purge</span>
                     </div>
                  </div>
                  {!isPro && <div className="w-2 h-2 rounded-full bg-primary" />}
               </button>

               <button 
                 disabled={!isPro}
                 onClick={() => addToast("Permanent vault active.", "success")}
                 className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPro ? 'bg-surface-container-high border-primary text-primary shadow-sm' : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant opacity-40 grayscale cursor-not-allowed'}`}
               >
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} />
                     <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest">Permanent Vault</span>
                        <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Never Delete</span>
                     </div>
                  </div>
                  {isPro && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
               </button>
            </div>
        </div>
    </div>
  );
};
