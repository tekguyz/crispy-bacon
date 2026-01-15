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
    <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex items-center p-4 gap-4 group">
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-xl border-2 border-outline-variant/20 overflow-hidden shadow-inner bg-surface-container-high flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={20} className="text-on-surface-variant/40" />
          )}
        </div>
        {isPro && (
          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1 rounded-md border-2 border-surface-container-low shadow-lg">
            <Crown size={8} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-on-surface tracking-tight truncate leading-none uppercase mb-1">{displayName}</h2>
          <div className="flex items-center gap-2">
             <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 truncate">
               {session?.user?.email || 'Local Session'}
             </span>
             {isPro && <span className="text-[7px] font-black text-primary uppercase bg-primary/5 px-1 rounded">PRO</span>}
          </div>
      </div>
    </div>
  );
};