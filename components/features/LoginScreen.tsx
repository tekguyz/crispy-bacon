import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import LandingPage from './auth/landing/LandingPage';
// Fix: AuthPortal is exported as a named constant in AuthPortal.tsx, so it must be imported using named import syntax
import { AuthPortal } from './auth/AuthPortal';
import { AppView } from '../../types';

type AuthMode = 'landing' | 'signin' | 'signup';

const LoginScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('landing');
  const store = useAppStore();

  if (mode === 'landing') {
    return (
      <LandingPage 
        onSignIn={() => setMode('signin')}
        onPrivacy={() => store.setView(AppView.PRIVACY)}
        onTerms={() => store.setView(AppView.TERMS)}
        onEthics={() => store.setView(AppView.AI_ETHICS)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.05] pointer-events-none" />
      
      {/* Structural markers instead of blurs */}
      <div className="absolute top-12 left-12 w-32 h-px bg-on-background/5 hidden md:block" />
      <div className="absolute top-12 left-12 h-32 w-px bg-on-background/5 hidden md:block" />
      <div className="absolute bottom-12 right-12 w-32 h-px bg-on-background/5 hidden md:block" />
      <div className="absolute bottom-12 right-12 h-32 w-px bg-on-background/5 hidden md:block" />

      <div className="relative z-10 w-full max-w-lg">
        <AuthPortal 
          mode={mode as 'signin' | 'signup'} 
          setMode={setMode as any} 
          onBack={() => setMode('landing')} 
        />
      </div>
    </div>
  );
};

export default LoginScreen;