
import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { signInWithGoogle } from '../../../services/supabaseClient';

export const IntegrationsSection: React.FC = () => {
  const { session, addToast } = useAppStore();
  
  const isGoogleLinked = session?.user?.app_metadata?.provider === 'google';
  const hasProviderToken = !!(session as any)?.provider_token;

  const handleLink = async () => {
    try {
      addToast("Connecting to Google...", "info");
      await signInWithGoogle();
    } catch (e: any) {
      addToast("Connection failed.", "error");
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-5 shadow-sm h-full flex flex-col justify-between gap-4 relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
         <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor"><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /></svg>
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
           {/* Fixed: Replaced bg-white with bg-surface for theme consistency */}
           <div className="w-10 h-10 rounded-xl bg-surface text-[#3c4043] flex items-center justify-center shadow-sm border border-outline-variant/10">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
           </div>
           <div className="flex flex-col leading-none">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface">Google Workspace</span>
              <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">Calendar & Drive</span>
           </div>
        </div>
        
        {(isGoogleLinked && hasProviderToken) ? (
           <div className="px-2 py-1 bg-success/10 text-success rounded-lg flex items-center gap-1.5 border border-success/10">
              <CheckCircle2 size={10} strokeWidth={4} />
              <span className="text-[8px] font-black uppercase tracking-widest">Connected</span>
           </div>
        ) : (
           <div className="px-2 py-1 bg-surface-container-high text-on-surface-variant/50 rounded-lg flex items-center gap-1.5 border border-outline-variant/10">
              <AlertCircle size={10} strokeWidth={3} />
              <span className="text-[8px] font-black uppercase tracking-widest">Not Connected</span>
           </div>
        )}
      </div>

      <div className="relative z-10">
          <button 
            onClick={handleLink}
            className={`w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${(isGoogleLinked && hasProviderToken) ? 'bg-surface-container-high border border-outline-variant/10 text-on-surface hover:bg-surface-container-highest' : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110'}`}
          >
            {(isGoogleLinked && hasProviderToken) ? <RefreshCw size={12} strokeWidth={3} /> : <ExternalLink size={12} strokeWidth={3} />}
            {(isGoogleLinked && hasProviderToken) ? 'Refresh Connection' : 'Connect Account'}
          </button>
      </div>
    </div>
  );
};