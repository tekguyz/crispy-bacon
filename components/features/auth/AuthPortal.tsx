
import React, { useState } from 'react';
import { Loader2, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, Lock } from 'lucide-react';
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
      setError(err.message || 'Authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-spring-up max-w-md mx-auto">
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
        
        <div className="p-8 md:p-10 flex flex-col relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6 p-4 bg-surface-container-high rounded-[2rem] shadow-inner border border-outline-variant/10">
               <BaconLogo className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-slab font-bold text-on-surface uppercase tracking-tight leading-none mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest max-w-[200px]">
              {mode === 'signin' ? 'Sign in to access your notes' : 'Start your private research library'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/5 border border-error/10 rounded-2xl flex items-center gap-3 animate-slide-up">
              <p className="text-[10px] font-black text-error uppercase tracking-widest leading-tight">{error}</p>
            </div>
          )}

          <button 
            onClick={handleGoogle} 
            disabled={isLoading} 
            className="w-full h-14 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-2xl flex items-center justify-center px-4 gap-4 border border-outline-variant/10 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm group hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 my-8">
             <div className="h-px bg-outline-variant/10 flex-1" />
             <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">or</span>
             <div className="h-px bg-outline-variant/10 flex-1" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="group relative">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 bg-surface-container-high/50 border border-outline-variant/10 focus:border-primary/40 focus:bg-surface-container-high rounded-2xl px-5 text-sm font-bold outline-none transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" strokeWidth={2.5} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-surface-container-high/50 border border-outline-variant/10 focus:border-primary/40 focus:bg-surface-container-high rounded-2xl px-5 pr-12 text-sm font-bold outline-none transition-all placeholder:text-on-surface-variant/30"
              />
            </div>

            <div className="relative group">
              {showPassword ? (
                 <button type="button" onClick={() => setShowPassword(false)} className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none">
                    <EyeOff size={16} strokeWidth={2.5} />
                 </button>
              ) : (
                 <button type="button" onClick={() => setShowPassword(true)} className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none">
                    <Eye size={16} strokeWidth={2.5} />
                 </button>
              )}
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-surface-container-high/50 border border-outline-variant/10 focus:border-primary/40 focus:bg-surface-container-high rounded-2xl px-5 pr-12 text-sm font-bold outline-none transition-all placeholder:text-on-surface-variant/30"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-on-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-2 group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button 
               onClick={() => { setError(null); triggerHaptic('light'); setMode(mode === 'signin' ? 'signup' : 'signin'); }}
               className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
             >
               {mode === 'signin' ? "Need an account? Sign up" : "Already a member? Sign in"}
             </button>
          </div>
        </div>

        <div className="bg-surface-container border-t border-outline-variant/10 p-5 flex items-center justify-between">
           <button onClick={onBack} className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface transition-all">
             Cancel
           </button>
           <div className="flex items-center gap-2 opacity-40">
              <Lock size={10} strokeWidth={2.5} />
              <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
        </div>
      </div>
    </div>
  );
};
