
import React, { useState } from 'react';
import { Loader2, ArrowLeft, ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Terminal, Fingerprint } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../../services/supabaseClient';
import { BaconLogo } from '../../ui/Logo';
import { triggerHaptic } from '../../../services/hapticService';

interface AuthPortalProps {
  mode: 'signin' | 'signup';
  setMode: (mode: 'signin' | 'signup') => void;
  onBack: () => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ mode, setMode, onBack }) => {
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
      setError(err.message || 'Connection to Google failed.'); 
      setIsLoading(false); 
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Credentials required.");
      return;
    }
    
    triggerHaptic('medium');
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!fullName) throw new Error("Name required.");
        await signUpWithEmail(email, password, fullName);
        setError("Account created. Verification required.");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-spring-up">
      <div className="bg-surface border-4 border-on-surface rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.4)] overflow-hidden relative group">
        
        <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
        
        {/* Hardware Status Strip */}
        <div className="h-10 bg-on-surface text-surface flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-3">
              <Terminal size={14} className="text-primary" />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em]">Node Connection: Secure</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[8px] font-mono font-black uppercase">Active</span>
           </div>
        </div>

        <div className="p-10 md:p-16 flex flex-col relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="mb-8 p-5 bg-surface-container-high rounded-[2rem] border-2 border-outline-variant/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
               <BaconLogo className="w-12 h-12" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-slab font-black tracking-tighter text-on-surface uppercase leading-none mb-3">
              {mode === 'signin' ? 'Verify.' : 'Establish.'}
            </h2>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
              {mode === 'signin' ? 'Resume strategic research' : 'Build your permanent vault'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-error/5 border-2 border-error/20 rounded-2xl flex items-center gap-4 animate-slide-up">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest text-error leading-tight">{error}</p>
            </div>
          )}

          {/* OAUTH BUTTONS */}
          <div className="space-y-3">
            <button 
              onClick={handleGoogle} 
              disabled={isLoading} 
              className="w-full h-16 bg-surface-container-highest hover:bg-background text-on-surface rounded-2xl flex items-center px-6 gap-6 border-2 border-on-surface/10 hover:border-primary transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm group/btn"
            >
              <div className="w-10 h-10 bg-background rounded-xl shadow-inner flex items-center justify-center border border-outline-variant/5">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none">Identity Check (Google)</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-6 my-10">
             <div className="h-px bg-on-surface/10 flex-1" />
             <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Credential Link</span>
             <div className="h-px bg-on-surface/10 flex-1" />
          </div>

          {/* EMAIL FORM */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="group relative">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-high border-2 border-on-surface/5 focus:border-primary/40 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none shadow-inner transition-all placeholder:text-on-surface-variant/30 uppercase tracking-widest"
                />
              </div>
            )}
            
            <div className="group relative">
              <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high border-2 border-on-surface/5 focus:border-primary/40 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none shadow-inner transition-all placeholder:text-on-surface-variant/30 uppercase tracking-widest"
              />
            </div>

            <div className="group relative">
              <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high border-2 border-on-surface/5 focus:border-primary/40 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none shadow-inner transition-all placeholder:text-on-surface-variant/30 uppercase tracking-widest"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-18 bg-on-surface text-surface rounded-2xl font-black text-[13px] uppercase tracking-[0.4em] shadow-xl hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed mt-4 ring-offset-4 ring-offset-background group-hover:ring-primary/10 transition-all duration-500"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'signin' ? 'Verify Identity' : 'Establish Node')}
              {!isLoading && <Fingerprint size={20} strokeWidth={2.5} />}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button 
               onClick={() => { setError(null); triggerHaptic('light'); setMode(mode === 'signin' ? 'signup' : 'signin'); }}
               className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
             >
               {mode === 'signin' ? "Not registered? Establish Vault" : "Active Member? Verify Entry"}
             </button>
          </div>
        </div>

        <div className="bg-surface-container-high border-t-2 border-on-surface/10 px-10 py-8 flex items-center justify-between">
           <button onClick={onBack} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-all group/back">
             <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover/back:bg-primary/10 shadow-sm border border-outline-variant/10">
                <ArrowLeft size={16} strokeWidth={3} />
             </div>
             Abort Session
           </button>
           <div className="flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono font-black uppercase text-on-surface">AES-256 Validated</span>
                <span className="text-[6px] font-mono font-black uppercase text-on-surface">ID: BACON_SEC_001</span>
              </div>
              <ShieldCheck size={18} className="text-success" strokeWidth={3} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
