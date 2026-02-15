
import React, { useState } from 'react';
import { Loader2, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../../services/supabaseClient';
import { BaconLogo } from '../../ui/Logo';
import { triggerHaptic } from '../../../services/hapticService';

interface AuthPortalProps {
  mode: 'signin' | 'signup';
  setMode: (mode: 'signin' | 'signup') => void;
  onBack: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ mode, setMode, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogle = async () => {
    triggerHaptic('medium');
    setIsLoading(true);
    setError(null);
    try { 
      await signInWithGoogle(); 
    } catch (err: any) { 
      setError('Connection to Google failed.'); 
      setIsLoading(false); 
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your details.");
      return;
    }
    
    triggerHaptic('medium');
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!fullName) throw new Error("Name required.");
        await signUpWithEmail(email, password, fullName);
        setError("Check your email to verify your account.");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-spring-up">
      {/* Mobile Back Button - positioned outside on mobile, hidden on desktop if preferred, or integrated */}
      <div className="mb-6 md:hidden">
         <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
           <ArrowRight className="rotate-180" size={12} strokeWidth={3} /> Back
         </button>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
        
        {/* Desktop Close/Back */}
        <button onClick={onBack} className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hidden md:block">
           <span className="sr-only">Close</span>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 hover:opacity-100"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-outline-variant/10 text-primary">
              <BaconLogo className="w-8 h-8" />
           </div>

           <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-on-surface mb-3 leading-none">
              {mode === 'signin' ? 'Welcome Back' : 'Join the Club'}
           </h2>
           <p className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mb-8">
              {mode === 'signin' ? 'Enter your credentials.' : 'Start your research journey.'}
           </p>

           {error && (
              <div className="w-full mb-6 p-4 bg-error/5 border border-error/20 rounded-xl flex items-center gap-3 text-left animate-slide-up">
                <ShieldCheck size={16} className="text-error shrink-0" />
                <p className="text-[10px] font-black text-error uppercase tracking-widest leading-tight">{error}</p>
              </div>
           )}

           <button 
              onClick={handleGoogle} 
              disabled={isLoading} 
              className="w-full h-14 bg-white dark:bg-surface-container-high text-[#3c4043] dark:text-white rounded-xl flex items-center justify-center gap-4 border border-outline-variant/20 hover:border-outline-variant/40 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 group mb-8"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest">Google Account</span>
           </button>

           <div className="w-full flex items-center gap-4 mb-8">
               <div className="h-px bg-outline-variant/10 flex-1" />
               <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">or email</span>
               <div className="h-px bg-outline-variant/10 flex-1" />
           </div>

           <form onSubmit={handleEmailAuth} className="w-full space-y-5 text-left">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 pl-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 bg-surface-container-high/30 border border-outline-variant/20 focus:border-primary/50 focus:bg-surface-container-high rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-on-surface-variant/20"
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 pl-1">Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors pointer-events-none" strokeWidth={2} />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-surface-container-high/30 border border-outline-variant/20 focus:border-primary/50 focus:bg-surface-container-high rounded-xl px-4 pr-10 text-sm font-medium outline-none transition-all placeholder:text-on-surface-variant/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 pl-1">Password</label>
                <div className="relative group">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none">
                      {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                  </button>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 bg-surface-container-high/30 border border-outline-variant/20 focus:border-primary/50 focus:bg-surface-container-high rounded-xl px-4 pr-10 text-sm font-medium outline-none transition-all placeholder:text-on-surface-variant/20"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary text-on-primary rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-6"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'signin' ? 'Enter Vault' : 'Create Account')}
                {!isLoading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
           </form>

           <div className="mt-8">
               <button 
                 onClick={() => { setError(null); triggerHaptic('light'); setMode(mode === 'signin' ? 'signup' : 'signin'); }}
                 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
               >
                 {mode === 'signin' ? "First time? Create account" : "Have an account? Sign in"}
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};
