
import React, { useState } from 'react';
import { X, ArrowRight, Check, Loader2, Library, Activity, Users, Star, ClipboardCheck, CornerDownRight } from 'lucide-react';
import { useFocusTrap } from '../../../../hooks/useFocusTrap';
import { triggerHaptic } from '../../../../services/hapticService';

type Step = 'identity' | 'scale' | 'needs' | 'success';

export const TeamInquiryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('identity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    size: '',
    requirements: [] as string[]
  });

  const containerRef = useFocusTrap(true, onClose);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerHaptic('light');
    if (step === 'identity') setStep('scale');
    else if (step === 'scale') setStep('needs');
    else handleSubmit();
  };

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const submissionData = {
        "form-name": "team-inquiry",
        "bot-field": "",
        name: formData.name,
        email: formData.email,
        size: formData.size,
        requirements: formData.requirements.join(", ")
      };

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(submissionData)
      });

      if (!response.ok) throw new Error("Transmission failed.");

      setLoading(false);
      setStep('success');
      triggerHaptic('heavy');
    } catch (err: any) {
      console.error("Netlify Form Error:", err);
      setError("Communication failed. Please try again.");
      setLoading(false);
    }
  };

  const toggleRequirement = (req: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(req) 
        ? prev.requirements.filter(r => r !== req) 
        : [...prev.requirements, req]
    }));
  };

  const isStepValid = () => {
    if (step === 'identity') return formData.name.length > 2 && formData.email.includes('@');
    if (step === 'scale') return formData.size !== '';
    if (step === 'needs') return formData.requirements.length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl animate-fade-in" onClick={onClose}>
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-surface border-4 border-on-surface rounded-[2.5rem] shadow-[0_60px_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative animate-spring-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
        
        <div className="h-14 bg-on-surface text-surface flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-3">
              <ClipboardCheck size={16} className="text-primary" />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em]">Inquiry Protocol: COLLECTIVE</span>
           </div>
           <button onClick={onClose} className="hover:text-primary transition-colors">
             <X size={20} strokeWidth={3} />
           </button>
        </div>

        <form 
          name="team-inquiry" 
          method="POST"
          data-netlify="true" 
          onSubmit={handleNext}
          className="contents"
        >
          <input type="hidden" name="form-name" value="team-inquiry" />
          <input type="hidden" name="bot-field" />
          
          <div className="p-10 md:p-16 flex-1 flex flex-col min-h-[480px] relative z-10">
            <header className="mb-14 space-y-6">
              <div className="flex items-center gap-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`h-2 rounded-full transition-all duration-700 shadow-inner ${
                     (step === 'identity' && i === 1) || 
                     (step === 'scale' && i <= 2) || 
                     (step === 'needs' && i <= 3) ||
                     step === 'success' ? 'bg-primary w-12' : 'bg-on-surface/10 w-4'
                   }`} />
                 ))}
              </div>
            </header>

            <main className="flex-1 flex flex-col">
              {error && (
                <div className="mb-8 p-5 bg-error/5 border-2 border-error/20 rounded-2xl text-error text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-slide-up">
                  <Activity size={16} /> {error}
                </div>
              )}

              {step === 'identity' && (
                <div className="space-y-10 animate-slide-up">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Command <br/><span className="text-primary italic">Contact.</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Initialize personal identity nodes</p>
                  </div>
                  <div className="space-y-3">
                    <div className="group relative">
                        <CornerDownRight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            autoFocus
                            type="text" 
                            name="name"
                            placeholder="Full Name" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full h-16 bg-surface-container-high border-2 border-outline-variant/10 rounded-2xl px-6 focus:px-10 text-lg font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner transition-all placeholder:text-on-surface-variant/20 uppercase tracking-widest"
                        />
                    </div>
                    <div className="group relative">
                        <CornerDownRight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Corporate Email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full h-16 bg-surface-container-high border-2 border-outline-variant/10 rounded-2xl px-6 focus:px-10 text-lg font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner transition-all placeholder:text-on-surface-variant/20 uppercase tracking-widest"
                        />
                    </div>
                  </div>
                </div>
              )}

              {step === 'scale' && (
                <div className="space-y-10 animate-slide-up">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Operational <br/><span className="text-primary italic">Scale.</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Select collective node count</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['1-10', '11-30', '31-100', '100+'].map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => { setFormData({...formData, size}); setStep('needs'); triggerHaptic('light'); }}
                        className={`h-20 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${formData.size === size ? 'bg-primary text-on-primary border-primary shadow-xl ring-4 ring-primary/10' : 'bg-surface-container-high border-outline-variant/10 text-on-surface hover:border-primary/30'}`}
                      >
                        {size} members
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'needs' && (
                <div className="space-y-10 animate-slide-up">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Collective <br/><span className="text-primary italic">Requirements.</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Check all applicable modules</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'library', label: 'Shared Library', icon: Library },
                      { id: 'analytics', label: 'Research Analytics', icon: Activity },
                      { id: 'training', label: 'Squad Onboarding', icon: Users },
                      { id: 'custom', label: 'Special Ops (Custom)', icon: Star },
                    ].map(req => {
                      const active = formData.requirements.includes(req.id);
                      return (
                        <button 
                          key={req.id}
                          type="button"
                          onClick={() => { toggleRequirement(req.id); triggerHaptic('light'); }}
                          className={`flex items-center gap-4 px-6 h-20 rounded-2xl border-2 transition-all active:scale-[0.98] ${active ? 'bg-primary text-on-primary border-primary shadow-lg' : 'bg-surface-container-high border-outline-variant/10 text-on-surface hover:border-primary/30'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${active ? 'bg-white/10 border-white/20' : 'bg-background/40 border-outline-variant/10'}`}>
                             <req.icon size={20} className={active ? 'text-white' : 'opacity-30'} />
                          </div>
                          <span className="font-black text-[11px] uppercase tracking-widest">{req.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-fade-in">
                  <div className="w-24 h-24 bg-success text-on-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-success/40 border-4 border-white/10">
                    <Check size={48} strokeWidth={4} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-slab font-bold uppercase tracking-tighter text-on-surface leading-none">Handshake <br/><span className="text-success">Complete.</span></h2>
                    <p className="text-lg font-medium font-serif text-on-surface-variant opacity-60 max-w-sm mx-auto leading-relaxed">The collective brief has been registered. Our specialists will respond within 24 operational hours.</p>
                  </div>
                  <button type="button" onClick={onClose} className="px-12 h-16 bg-on-surface text-surface rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-primary transition-all active:scale-95">Back to Unit</button>
                </div>
              )}
            </main>

            {step !== 'success' && (
              <footer className="mt-14 pt-8 border-t-2 border-outline-variant/10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono font-black text-on-surface-variant opacity-30 uppercase tracking-[0.5em]">Auth Code</span>
                  <span className="text-[10px] font-mono font-black text-on-surface opacity-10">RE-449-ALPHA</span>
                </div>
                <button 
                  type="submit"
                  disabled={loading || isStepValid() === false}
                  className="flex items-center gap-4 px-12 h-16 bg-on-surface text-surface rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all active:scale-95 disabled:opacity-20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : step === 'needs' ? 'Initialize' : 'Next Node'}
                  {!loading && <ArrowRight size={20} strokeWidth={3} />}
                </button>
              </footer>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
