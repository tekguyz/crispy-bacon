
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
        className="w-full max-w-lg bg-surface border border-outline-variant/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative animate-spring-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
        
        <div className="h-14 bg-surface-container-low flex items-center justify-between px-8 shrink-0 border-b border-outline-variant/10">
           <div className="flex items-center gap-3">
              <ClipboardCheck size={16} className="text-primary" />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em]">Contact Sales</span>
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
          
          <div className="p-10 md:p-12 flex-1 flex flex-col min-h-[480px] relative z-10">
            <header className="mb-10 space-y-6">
              <div className="flex items-center gap-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-700 shadow-inner ${
                     (step === 'identity' && i === 1) || 
                     (step === 'scale' && i <= 2) || 
                     (step === 'needs' && i <= 3) ||
                     step === 'success' ? 'bg-primary w-8' : 'bg-outline-variant/10 w-3'
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
                    <h2 className="text-3xl md:text-4xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Your <br/><span className="text-primary italic">Details.</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Enter your information below</p>
                  </div>
                  <div className="space-y-3">
                    <div className="group relative">
                        <CornerDownRight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            autoFocus={typeof window !== 'undefined' && window.innerWidth >= 768}
                            type="text" 
                            name="name"
                            placeholder="Full Name" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 bg-surface-container-high border border-outline-variant/10 rounded-2xl px-5 focus:px-10 text-sm font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner transition-all placeholder:text-on-surface-variant/30 uppercase tracking-widest"
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
                            className="w-full h-14 bg-surface-container-high border border-outline-variant/10 rounded-2xl px-5 focus:px-10 text-sm font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner transition-all placeholder:text-on-surface-variant/30 uppercase tracking-widest"
                        />
                    </div>
                  </div>
                </div>
              )}

              {step === 'scale' && (
                <div className="space-y-10 animate-slide-up">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">Team <br/><span className="text-primary italic">Size.</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">How many people?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['1-10', '11-30', '31-100', '100+'].map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => { setFormData({...formData, size}); setStep('needs'); triggerHaptic('light'); }}
                        className={`h-16 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] ${formData.size === size ? 'bg-primary text-on-primary border-primary shadow-xl ring-2 ring-primary/20' : 'bg-surface-container-high border-outline-variant/10 text-on-surface hover:border-primary/30'}`}
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
                    <h2 className="text-3xl md:text-4xl font-slab font-bold tracking-tighter uppercase text-on-surface leading-none">What do <br/><span className="text-primary italic">You Need?</span></h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em]">Check all that apply</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'library', label: 'Shared Library', icon: Library },
                      { id: 'analytics', label: 'Analytics', icon: Activity },
                      { id: 'training', label: 'Team Onboarding', icon: Users },
                      { id: 'custom', label: 'Custom Solutions', icon: Star },
                    ].map(req => {
                      const active = formData.requirements.includes(req.id);
                      return (
                        <button 
                          key={req.id}
                          type="button"
                          onClick={() => { toggleRequirement(req.id); triggerHaptic('light'); }}
                          className={`flex items-center gap-4 px-5 h-14 rounded-2xl border transition-all active:scale-[0.98] ${active ? 'bg-primary text-on-primary border-primary shadow-lg' : 'bg-surface-container-high border-outline-variant/10 text-on-surface hover:border-primary/30'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${active ? 'bg-on-primary/10 border-on-primary/20' : 'bg-background/40 border-outline-variant/10'}`}>
                             <req.icon size={16} className={active ? 'text-on-primary' : 'opacity-30'} />
                          </div>
                          <span className="font-black text-[10px] uppercase tracking-widest">{req.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
                  <div className="w-20 h-20 bg-success text-on-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-success/20 border-2 border-on-primary/10">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-slab font-bold uppercase tracking-tighter text-on-surface leading-none">Request <br/><span className="text-success">Sent.</span></h2>
                    <p className="text-sm font-medium font-serif text-on-surface-variant opacity-60 max-w-xs mx-auto leading-relaxed">We have received your details. Our team will contact you shortly.</p>
                  </div>
                  <button type="button" onClick={onClose} className="px-10 h-14 bg-on-surface text-surface rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all active:scale-95">Close</button>
                </div>
              )}
            </main>

            {step !== 'success' && (
              <footer className="mt-10 pt-6 border-t border-outline-variant/10 flex justify-end items-center">
                <button 
                  type="submit"
                  disabled={loading || isStepValid() === false}
                  className="flex items-center gap-3 px-8 h-12 bg-on-surface text-surface rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:bg-primary transition-all active:scale-95 disabled:opacity-20"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : step === 'needs' ? 'Submit' : 'Next'}
                  {!loading && <ArrowRight size={16} strokeWidth={3} />}
                </button>
              </footer>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
