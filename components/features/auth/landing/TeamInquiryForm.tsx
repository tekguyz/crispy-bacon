
import React, { useState } from 'react';
import { X, ArrowRight, Check, Loader2, Library, Activity, Users, Star } from 'lucide-react';
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-surface-container-low border-4 border-foreground/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative animate-spring-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-foreground/40 hover:text-foreground transition-colors">
          <X size={24} />
        </button>

        <form 
          name="team-inquiry" 
          method="POST"
          data-netlify="true" 
          onSubmit={handleNext}
          className="contents"
        >
          <input type="hidden" name="form-name" value="team-inquiry" />
          <input type="hidden" name="bot-field" />
          
          <div className="p-10 md:p-16 flex-1 flex flex-col min-h-[450px]">
            <header className="mb-12 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Team Briefing</span>
              <div className="flex items-center gap-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                     (step === 'identity' && i === 1) || 
                     (step === 'scale' && i <= 2) || 
                     (step === 'needs' && i <= 3) ||
                     step === 'success' ? 'bg-primary w-8' : 'bg-foreground/10 w-2'
                   }`} />
                 ))}
              </div>
            </header>

            <main className="flex-1 flex flex-col">
              {error && (
                <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl text-error text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} /> {error}
                </div>
              )}

              {step === 'identity' && (
                <div className="space-y-8 animate-slide-up">
                  <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-foreground leading-none">Who's leading <br/><span className="text-primary">the team?</span></h2>
                  <div className="space-y-4">
                    <input 
                      autoFocus
                      type="text" 
                      name="name"
                      placeholder="Your Name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 md:h-12 bg-card border-2 border-foreground/10 rounded-2xl px-6 text-lg font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner placeholder:text-on-surface-variant/40"
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Work Email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full h-14 md:h-12 bg-card border-2 border-foreground/10 rounded-2xl px-6 text-lg font-bold text-on-surface outline-none focus:border-primary/40 shadow-inner placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>
              )}

              {step === 'scale' && (
                <div className="space-y-8 animate-slide-up">
                  <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-foreground leading-none">Your team <br/><span className="text-primary">size?</span></h2>
                  <div className="grid grid-cols-2 gap-3">
                    {['1-10', '11-30', '31-100', '100+'].map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => { setFormData({...formData, size}); setStep('needs'); triggerHaptic('light'); }}
                        className={`h-16 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${formData.size === size ? 'bg-primary text-on-primary border-primary shadow-xl' : 'bg-card border-foreground/10 text-on-surface hover:border-primary/30'}`}
                      >
                        {size} members
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'needs' && (
                <div className="space-y-8 animate-slide-up">
                  <h2 className="text-3xl md:text-5xl font-slab font-bold tracking-tighter uppercase text-foreground leading-none">How can <br/><span className="text-primary">we help?</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'library', label: 'Shared Library', icon: Library },
                      { id: 'analytics', label: 'Research Insights', icon: Activity },
                      { id: 'training', label: 'Onboarding', icon: Users },
                      { id: 'custom', label: 'Custom Needs', icon: Star },
                    ].map(req => {
                      const active = formData.requirements.includes(req.id);
                      return (
                        <button 
                          key={req.id}
                          type="button"
                          onClick={() => toggleRequirement(req.id)}
                          className={`flex items-center gap-4 px-6 h-16 rounded-2xl border-2 transition-all active:scale-95 ${active ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-foreground/10 text-on-surface hover:border-primary/30'}`}
                        >
                          <req.icon size={20} className={active ? 'text-primary' : 'opacity-40'} />
                          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">{req.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-slab font-bold uppercase tracking-tighter">Message Sent.</h2>
                    <p className="text-lg font-medium text-foreground/60 max-w-xs">We'll reach out with team options within 24 hours.</p>
                  </div>
                  <button type="button" onClick={onClose} className="px-10 h-14 md:h-12 bg-foreground text-background rounded-xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] hover:opacity-90">Back to Studio</button>
                </div>
              )}
            </main>

            {step !== 'success' && (
              <footer className="mt-12 pt-8 border-t border-foreground/5 flex justify-between items-center">
                <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Professional Support</p>
                <button 
                  type="submit"
                  disabled={loading || isStepValid() === false}
                  className="flex items-center gap-3 px-10 h-14 md:h-12 bg-foreground text-background rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] shadow-xl hover:brightness-110 disabled:opacity-20 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : step === 'needs' ? 'Initialize' : 'Next'}
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
