
import React, { useState, useCallback } from 'react';
import { 
  X, Crown, Zap, Loader2, 
  ArrowRight, Target, Database, Radio, 
  ShieldCheck, Infinity, Check
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { triggerHaptic } from '../../services/hapticService';

const UpgradeModal: React.FC = () => {
  const { 
    showUpgradeModal, 
    setShowUpgradeModal, 
    session, 
    addToast, 
    isGuest, 
    signOut, 
    upgradeToPro 
  } = useAppStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (!isProcessing) {
      triggerHaptic('light');
      setIsClosing(true);
      setTimeout(() => {
        setShowUpgradeModal(false);
        setIsClosing(false);
      }, 300);
    }
  }, [isProcessing, setShowUpgradeModal]);

  const containerRef = useFocusTrap(showUpgradeModal, handleClose);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    triggerHaptic('medium');
    
    if (isGuest || !session) {
      addToast("Identity Required. Redirecting to Vault Entry...", "info");
      setTimeout(() => {
        setIsProcessing(false);
        setShowUpgradeModal(false);
        signOut();
      }, 1500);
      return;
    }

    try {
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id, email: session.user.email })
        });

        if (!response.ok) throw new Error("Bridge Offline");

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("Invalid Response");
        }
    } catch (error: any) {
        await new Promise(resolve => setTimeout(resolve, 800));
        await upgradeToPro();
        addToast("Executive Tier Provisioned.", "success");
        setIsProcessing(false);
        setShowUpgradeModal(false);
    }
  };

  if (!showUpgradeModal) return null;

  const proFeatures = [
    { label: 'Unlimited Research', icon: Infinity, desc: 'No monthly caps.' },
    { label: 'Permanent Library', icon: Database, desc: 'Lifetime storage.' },
    { label: 'Deep Reasoning', icon: Target, desc: 'Strategist models.' },
    { label: 'Voice Questions', icon: Radio, desc: 'Talk to notes.' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[210] flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" onClick={handleClose}>
      <div 
        ref={containerRef}
        className={`bg-background w-[calc(100%-1.5rem)] md:w-full md:max-w-4xl rounded-t-expressive md:rounded-expressive max-h-[90dvh] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 focus:outline-none relative ${isClosing ? 'animate-sheet-down' : 'md:animate-spring-up animate-sheet-up'} ring-1 ring-outline/10`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* M3 Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2 shrink-0">
           <div className="w-12 h-1 bg-outline-variant/20 rounded-full" />
        </div>

        <button 
             onClick={handleClose}
             className="absolute top-4 right-4 z-50 p-2 bg-on-surface/5 text-on-surface rounded-full hover:bg-on-surface/10 transition-all backdrop-blur-md interactive hidden md:block"
             aria-label="Close"
        >
             <X size={20} strokeWidth={3} />
        </button>

        {/* LEFT BRAND PANEL (Desktop Only) */}
        <div className="hidden md:flex w-[40%] bg-on-surface text-surface p-8 flex-col justify-between relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none select-none">
              <Crown size={120} />
           </div>

           <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg mb-2">
                    <Crown size={20} fill="currentColor" />
                 </div>
                 <h2 id="upgrade-title" className="text-2xl lg:text-3xl font-black tracking-tighter uppercase leading-none">
                   The <br /> <span className="text-primary">Executive.</span>
                 </h2>
              </div>

              <div className="space-y-4">
                {proFeatures.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                     <div className="w-8 h-8 rounded-lg bg-surface/10 flex items-center justify-center shrink-0 border border-surface/10 text-primary">
                        <item.icon size={14} strokeWidth={2.5} />
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 truncate">{item.label}</span>
                        <span className="text-[8px] font-medium opacity-40 uppercase tracking-widest truncate">{item.desc}</span>
                     </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="relative z-10 pt-6 border-t border-surface/5">
              <div className="flex items-center gap-2 text-[7px] font-black text-primary uppercase tracking-[0.4em]">
                 <ShieldCheck size={10} /> Tier Safety Verified
              </div>
           </div>
        </div>

        {/* RIGHT ACTION PANEL */}
        <div className="flex-1 bg-surface-container flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 ledger-grid opacity-[0.1] pointer-events-none" />
          
          <div className="overflow-y-auto custom-scrollbar flex-1 p-6 md:p-10 flex flex-col items-center justify-center min-h-full relative z-10">
              <div className="max-w-sm w-full space-y-6">
                  <div className="text-center space-y-1">
                     <div className="px-3 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full w-fit mx-auto mb-2">
                        <span className="text-[7px] font-black uppercase tracking-[0.3em]">Professional Standard</span>
                     </div>
                     <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-on-surface">Member Activation</h3>
                  </div>

                  <div className="bg-background rounded-expressive border border-outline-variant/10 shadow-lg overflow-hidden relative">
                     <div className="h-1 bg-primary w-full" />
                     <div className="p-6 md:p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-0.5">
                               <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40">Active Tier</p>
                               <p className="text-lg font-black uppercase text-on-surface">Pro</p>
                            </div>
                            <div className="text-right space-y-0.5">
                               <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40">Price</p>
                               <p className="text-2xl font-black text-primary tracking-tighter">$20<span className="text-[10px] text-on-surface-variant font-bold">/MO</span></p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                           {[
                             "Unlimited Recaps",
                             "60-Minute Sessions",
                             "Deep Strategist",
                             "Voice Assistant"
                           ].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                                <Check size={12} className="text-success" strokeWidth={4} />
                                <span>{feat}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleUpgrade}
                      disabled={isProcessing}
                      className="w-full h-14 md:h-12 bg-primary text-on-primary rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 group"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <>Activate Membership <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                    <p className="text-[7px] text-center font-black text-on-surface-variant opacity-30 uppercase tracking-[0.4em]">One-Tap Activation • Cloud Secure</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
