
import React from 'react';
import { Crown, User } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const IdentitySection: React.FC = () => {
  const { session, userProfile } = useAppStore();
  
  const metadata = session?.user?.user_metadata || {};
  const avatarUrl = metadata.picture || userProfile?.avatar_url || metadata.avatar_url;
  const displayName = userProfile?.full_name || metadata.full_name || metadata.name || session?.user?.email?.split('@')[0] || 'Guest Strategist';
  const isPro = !!userProfile?.is_pro;

  return (
    <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex items-center p-5 gap-5 h-full relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <User size={64} />
      </div>

      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-2xl border-2 border-outline-variant/20 overflow-hidden shadow-inner bg-surface-container-high flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={24} className="text-on-surface-variant/40" />
          )}
        </div>
        {isPro && (
          <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-on-primary p-1 rounded-lg border-2 border-surface-container-low shadow-lg">
            <Crown size={10} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 relative z-10">
          <h2 className="text-base font-black text-on-surface tracking-tight truncate leading-none uppercase mb-1.5">{displayName}</h2>
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-bold text-on-surface-variant/60 truncate">
               {session?.user?.email || 'Local Session'}
             </span>
             <span className={`text-[7px] font-black uppercase tracking-widest w-fit px-1.5 py-0.5 rounded ${isPro ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
               {isPro ? 'Executive Tier' : 'Standard Tier'}
             </span>
          </div>
      </div>
    </div>
  );
};
