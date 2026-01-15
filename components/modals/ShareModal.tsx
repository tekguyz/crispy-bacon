
import React, { useState, useCallback } from 'react';
import { X, Copy, Check, Globe, Clock, Share2, Music, Target, Zap, Crown, Mail, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ContentType } from '../../types';
import { triggerHaptic } from '../../services/hapticService';
import { Tooltip } from '../ui/Tooltip';

const ShareModal: React.FC = () => {
  const { 
    selectedInsight, 
    setShowShareModal, 
    createShareLink, 
    addToast,
    userProfile,
    setShowUpgradeModal
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [expiresHours, setExpiresHours] = useState<number | null>(24);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);

  const handleClose = useCallback(() => {
    setShowShareModal(false);
  }, [setShowShareModal]);

  const containerRef = useFocusTrap(true, handleClose);

  const isPro = !!userProfile?.is_pro;
  const isAudioCapable = selectedInsight?.type === ContentType.MEETING;
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleGenerate = async () => {
    if (!selectedInsight) return;
    setIsLoading(true);
    triggerHaptic('light');
    try {
      const link = await createShareLink(selectedInsight, { 
        expiresHours, 
        includeAudio: includeAudio && isPro, 
        isCollaborative: isCollaborative && isPro 
      });
      if (link) setShareLink(link);
    } catch (err: any) {
        addToast("Failed to create link.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (url: string, msg: string = "Link copied") => {
    triggerHaptic('light');
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast(msg, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const security = isCollaborative ? { label: 'Live Collaboration', color: 'text-primary', icon: Zap } : 
                  (!expiresHours ? { label: 'Permanent Link', color: 'text-on-surface', icon: Globe } : 
                  { label: 'Expires soon', color: 'text-on-surface-variant', icon: Clock });

  if (!selectedInsight) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[210] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" onClick={handleClose}>
      <div 
        ref={containerRef}
        className="bg-background w-[calc(100%-2rem)] md:max-w-lg rounded-expressive shadow-2xl overflow-hidden flex flex-col animate-sheet-up md:animate-scale-in ring-1 ring-white/10 focus:outline-none max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* M3 Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2 shrink-0">
           <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 bg-surface-container-low shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant/10 text-primary shadow-inner">
              <Share2 size={18} />
            </div>
            <div className="flex flex-col">
                <h2 className="text-lg font-black text-on-surface tracking-tight uppercase leading-none">Share Note</h2>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Privacy Settings</span>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 bg-background">
          <div className="space-y-6">
             {shareLink ? (
                <div className="animate-fade-in space-y-6">
                  <div className="bg-surface-container-low border border-outline-variant/10 p-3 rounded-2xl flex gap-2 shadow-inner">
                    <input readOnly value={shareLink} className="flex-1 bg-transparent text-xs font-mono font-bold text-on-surface px-4 py-3 outline-none truncate" />
                    <button onClick={() => copyToClipboard(shareLink)} className="px-6 h-12 md:h-10 bg-surface-container-highest text-on-surface rounded-xl font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                        if (canNativeShare) {
                            navigator.share({ title: selectedInsight.title, url: shareLink });
                        } else {
                            copyToClipboard(shareLink);
                        }
                    }}
                    className="w-full flex items-center justify-center gap-3 h-14 md:h-12 bg-primary text-on-primary rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all"
                  >
                    {canNativeShare ? <Share2 size={16} strokeWidth={3} /> : <Mail size={16} strokeWidth={3} />}
                    {canNativeShare ? 'Share Link' : 'Copy Web URL'}
                  </button>
                  <button onClick={() => setShareLink('')} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity py-2">Adjust settings</button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <section className="space-y-3">
                     <div className="flex items-center gap-2 px-1 mb-1">
                        <Target size={12} className="text-primary" />
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">Capabilities</h3>
                     </div>

                     <div className={`flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/10 rounded-[1.5rem] group transition-all`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center text-on-surface-variant opacity-60 group-hover:text-primary transition-all shadow-inner ${includeAudio ? 'text-primary' : ''}`}>
                              <Music size={18} />
                           </div>
                           <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                 <span className="text-[11px] font-black uppercase tracking-widest text-on-surface">Include Audio</span>
                                 {!isPro && <Crown size={9} className="text-primary" />}
                              </div>
                              <span className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest leading-none mt-1">
                                {isAudioCapable ? 'Allow playback' : 'No audio source'}
                              </span>
                           </div>
                        </div>
                        <button 
                           onClick={() => isPro ? setIncludeAudio(!includeAudio) : setShowUpgradeModal(true)}
                           disabled={!isAudioCapable}
                           className={`w-11 h-6 rounded-full transition-all relative shadow-inner ${!isAudioCapable ? 'opacity-20 grayscale cursor-not-allowed' : 'cursor-pointer'} ${includeAudio ? 'bg-primary' : 'bg-surface-container-highest'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${includeAudio ? 'left-6' : 'left-1'}`} />
                        </button>
                     </div>

                     <div className={`flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/10 rounded-[1.5rem] group transition-all`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center text-on-surface-variant opacity-60 group-hover:text-primary transition-all shadow-inner ${isCollaborative ? 'text-primary' : ''}`}>
                              <Zap size={18} />
                           </div>
                           <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                 <span className="text-[11px] font-black uppercase tracking-widest text-on-surface">Live Sync</span>
                                 {!isPro && <Crown size={9} className="text-primary" />}
                              </div>
                              <span className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest leading-none mt-1">Collab task tracking</span>
                           </div>
                        </div>
                        <button 
                           onClick={() => isPro ? setIsCollaborative(!isCollaborative) : setShowUpgradeModal(true)}
                           className={`w-11 h-6 rounded-full cursor-pointer transition-all relative shadow-inner ${isCollaborative ? 'bg-primary' : 'bg-surface-container-highest'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${isCollaborative ? 'left-6' : 'left-1'}`} />
                        </button>
                     </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Clock size={12} className="text-on-surface-variant opacity-40" />
                      <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">Expiration Limit</label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[{l:'24 Hours',v:24},{l:'7 Days',v:168},{l:'Never',v:null}].map(o => (
                        <button key={o.l} onClick={()=>setExpiresHours(o.v)} className={`h-14 md:h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${expiresHours===o.v?'bg-primary/10 border-primary text-primary shadow-sm':'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high'}`}>{o.l}</button>
                      ))}
                    </div>
                  </section>

                  <button 
                    onClick={handleGenerate} 
                    disabled={isLoading} 
                    className="w-full h-16 md:h-14 bg-primary text-on-primary rounded-[1.75rem] font-black text-[11px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Globe size={20} strokeWidth={3} />} 
                      {isLoading ? 'PREPARING...' : 'GENERATE PUBLIC LINK'}
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between shrink-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Link Privacy</span>
              <span className={`text-[10px] font-black flex items-center gap-1.5 ${security.color}`}><security.icon size={10} fill={isCollaborative ? "currentColor" : "none"}/> {security.label}</span>
            </div>
            <div className="text-[7px] font-mono font-bold opacity-30 text-on-surface uppercase tracking-widest">
              SECURE
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
