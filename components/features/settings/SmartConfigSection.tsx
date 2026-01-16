import React from 'react';
import { Brain, Zap, CheckCircle2, Target, HelpCircle, Archive, ShieldCheck, Clock, Gauge } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="bg-surface-container-low border border-outline rounded-[2rem] p-8 md:p-10 space-y-12 shadow-sm">
        
        {/* ROW 1: VOICE & FRAMEWORK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Assistant Voice */}
          <div className="space-y-6">
              <div className="flex items-center justify-between mb-1 px-1">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Assistant Voice</label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {voices.map(v => (
                    <button 
                      key={v}
                      onClick={() => setPreferredVoice(v)}
                      className={`h-10 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${preferredVoice === v ? 'bg-primary border-primary text-on-primary shadow-lg' : 'bg-surface-container border-outline text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                        {v}
                    </button>
                  ))}
              </div>

              <div className="space-y-3 pt-2">
                 <div className="flex items-center gap-2 px-1">
                    <Gauge size={12} className="text-on-surface-variant/40" />
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">Speaking Rate: {voiceSpeed}x</label>
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
                 <div className="flex justify-between px-1 text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">
                    <span>Relaxed</span>
                    <span>Rapid</span>
                 </div>
              </div>
          </div>

          {/* Analysis Framework */}
          <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60 px-1">Default Focus</label>
              <div className="grid grid-cols-1 gap-2">
              {Object.values(InsightTemplate).map(t => (
                  <button 
                      key={t}
                      onClick={() => setPreferredTemplate(t)}
                      className={`flex items-center justify-between h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${preferredTemplate === t ? 'bg-surface-container-high border-primary text-primary shadow-sm' : 'bg-surface-container border-outline text-on-surface-variant opacity-60 hover:opacity-100'}`}
                  >
                      <span>{labels[t]}</span>
                      {preferredTemplate === t && <CheckCircle2 size={12} className="text-primary" strokeWidth={3} />}
                  </button>
              ))}
              </div>
          </div>
        </div>

        {/* ROW 2: AUTOMATION & RETENTION */}
        <div className="pt-10 border-t border-outline-variant/10 space-y-6">
            <div className="flex items-center gap-3 px-1">
              <Archive size={14} className="text-primary" strokeWidth={3} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface">Data Retention</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => addToast("Automation preferences saved.", "success")}
                 className="flex items-center justify-between p-5 bg-surface-container-high border border-outline rounded-2xl group interactive"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-background border border-outline flex items-center justify-center text-on-surface-variant opacity-40 group-hover:text-primary transition-colors shadow-inner">
                        <Clock size={18} />
                     </div>
                     <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Auto-Archive</span>
                        <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest">After 30 days</span>
                     </div>
                  </div>
                  <div className="w-10 h-5 bg-on-surface/10 rounded-full relative">
                     <div className="absolute left-1 top-1 w-3 h-3 bg-on-surface-variant rounded-full" />
                  </div>
               </button>

               <button 
                 disabled={!isPro}
                 onClick={() => addToast("Pro retention active.", "success")}
                 className={`flex items-center justify-between p-5 bg-surface-container-high border border-outline rounded-2xl group interactive ${!isPro ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-background border border-outline flex items-center justify-center text-on-surface-variant opacity-40 group-hover:text-primary transition-colors shadow-inner">
                        <ShieldCheck size={18} />
                     </div>
                     <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Keep Forever</span>
                        <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Never Purge</span>
                     </div>
                  </div>
                  <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                     <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-sm" />
                  </div>
               </button>
            </div>
        </div>

        {/* ROW 3: RESEARCH DEPTH */}
        <div className="pt-10 border-t border-outline-variant/10 space-y-6">
            <div className="flex items-center gap-3 px-1">
              <Brain size={14} className="text-primary" strokeWidth={3} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface">Detail Level</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                  onClick={() => setPersonaStyle(PersonaStyle.CONCISE)}
                  className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left relative group ${personaStyle === PersonaStyle.CONCISE ? 'bg-surface-container-high border-primary shadow-lg ring-4 ring-primary/5' : 'bg-surface-container border-outline opacity-60 hover:opacity-100'}`}
              >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${personaStyle === PersonaStyle.CONCISE ? 'text-primary' : 'text-on-surface-variant'}`}>Standard Recap</span>
                    {personaStyle === PersonaStyle.CONCISE && <CheckCircle2 size={18} className="text-primary" strokeWidth={3} />}
                  </div>
                  <p className="text-[11px] font-bold text-on-surface-variant leading-relaxed mb-3 uppercase tracking-widest">Optimized for speed. Immediate decisions and next steps.</p>
                  <span className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Included in Basic</span>
              </button>

              <button 
                  onClick={() => isPro ? setPersonaStyle(PersonaStyle.DEEP_RESEARCH) : null}
                  className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left relative group ${personaStyle === PersonaStyle.DEEP_RESEARCH ? 'bg-surface-container-high border-primary shadow-lg ring-4 ring-primary/5' : 'bg-surface-container border-outline opacity-60'} ${!isPro ? 'grayscale cursor-not-allowed' : 'hover:opacity-100'}`}
              >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <span className={`text-[11px] font-black uppercase tracking-widest ${personaStyle === PersonaStyle.DEEP_RESEARCH ? 'text-primary' : 'text-on-surface-variant'}`}>Deep Analysis</span>
                       <Zap size={12} fill="currentColor" className="text-primary animate-pulse" />
                    </div>
                    {personaStyle === PersonaStyle.DEEP_RESEARCH && <CheckCircle2 size={18} className="text-primary" strokeWidth={3} />}
                  </div>
                  <p className="text-[11px] font-bold text-on-surface-variant leading-relaxed mb-3 uppercase tracking-widest">High-density reasoning. Maximum nuance extraction from complex calls.</p>
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Executive Tier Access</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};