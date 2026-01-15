
import { StateCreator } from 'zustand';
import { AppState, AuthSlice } from './types';
import { supabase, isSupabaseConfigured, signOut as supabaseSignOut, signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/supabaseClient';
import { AppView } from '../types';

// v2.4.0: High-Durability Stash
const BRIDGE_STASH_KEY = 'cb_google_bridge_vault';
const HANDSHAKE_GUARD_KEY = 'cb_handshake_active';

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => ({
  session: null,
  userProfile: null,
  isSupabaseActive: false,
  authLoading: true,
  isGuest: false, // Force guest mode off by default

  initAuth: async () => {
    const { logSystemEvent, fetchData } = get();
    const configured = isSupabaseConfigured();
    set({ isSupabaseActive: configured });
    
    if (!configured) {
      set({ authLoading: false });
      return;
    }

    try {
      const { data: { session: rawSession }, error } = await supabase.auth.getSession();
      
      let session = rawSession;
      if (session) {
        // v2.4.0: DEEP BRIDGE RECOVERY
        // Check if we have a token in the vault that Supabase lost on refresh
        let providerToken = (session as any).provider_token;
        
        if (!providerToken) {
           const vaulted = localStorage.getItem(BRIDGE_STASH_KEY);
           if (vaulted) {
              try {
                const data = JSON.parse(vaulted);
                const ageMins = (Date.now() - data.ts) / (1000 * 60);
                
                // If token is still fresh (Google tokens = 60m), inject it back into the session
                if (ageMins < 55) {
                   (session as any).provider_token = data.token;
                   (session as any)._handshake_ts = data.ts;
                   logSystemEvent(`[BRIDGE] Intelligence restored from vault (${Math.round(ageMins)}m old).`);
                } else {
                   localStorage.removeItem(BRIDGE_STASH_KEY);
                }
              } catch (e) {
                localStorage.removeItem(BRIDGE_STASH_KEY);
              }
           }
        } else {
           // Fresh token from Supabase! Secure it in the vault.
           localStorage.setItem(BRIDGE_STASH_KEY, JSON.stringify({
             token: providerToken,
             ts: Date.now()
           }));
           (session as any)._handshake_ts = Date.now();
        }
        
        set({ session, isGuest: false, authLoading: false });
        await get().fetchProfile();
      } else {
        set({ authLoading: false });
      }

      supabase.auth.onAuthStateChange(async (event: any, newSession: any | null) => {
        if (newSession) {
          // VAULTING PROTOCOL: Immediately secure the provider_token IF it exists
          if (newSession.provider_token) {
             localStorage.setItem(BRIDGE_STASH_KEY, JSON.stringify({
               token: newSession.provider_token,
               ts: Date.now()
             }));
             (newSession as any)._handshake_ts = Date.now();
             localStorage.removeItem(HANDSHAKE_GUARD_KEY); // Reset guard on success
          }

          const isNewUser = !get().session;
          set({ session: newSession, isGuest: false, authLoading: false });
          if (isNewUser) {
            await get().fetchProfile();
            await fetchData();
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.clear();
          set({ userProfile: null, session: null, isGuest: false, insights: [], view: AppView.DASHBOARD });
        }
      });

    } catch (e: any) {
      logSystemEvent(`[AUTH_ERROR] ${e.message}`, 'error');
      set({ authLoading: false });
    }
  },

  ensureValidProviderToken: async () => {
    const { session, logSystemEvent } = get();
    if (!session) return false;

    // Detect if this is a Google user based on metadata
    const isGoogleUser = session.user?.app_metadata?.provider === 'google';
    const providerToken = (session as any).provider_token;
    
    // If not a Google user, we don't enforce token presence.
    if (!isGoogleUser) return false;

    // Check Guard Staleness (Prevent permanent loops, but allow retry after 2 minutes)
    const guard = localStorage.getItem(HANDSHAKE_GUARD_KEY);
    if (guard) {
        const guardTime = parseInt(guard, 10);
        if (Date.now() - guardTime < 120000) {
            return false; // Still within guard window
        }
        // Guard expired, clear it
        localStorage.removeItem(HANDSHAKE_GUARD_KEY);
    }

    // SCENARIO 1: Token Missing Completely
    if (!providerToken) {
      // Try one last vault check
      const vaulted = localStorage.getItem(BRIDGE_STASH_KEY);
      if (vaulted) {
          try {
            const data = JSON.parse(vaulted);
            if ((Date.now() - data.ts) / 60000 < 55) {
                (session as any).provider_token = data.token;
                (session as any)._handshake_ts = data.ts;
                return true; // Recovered!
            }
          } catch(e) {}
      }

      logSystemEvent("[BRIDGE] Token lost. Initiating recovery protocol.");
      localStorage.setItem(HANDSHAKE_GUARD_KEY, Date.now().toString());
      try {
        await signInWithGoogle();
      } catch (e) {
        console.error("Auto-recovery failed", e);
        localStorage.removeItem(HANDSHAKE_GUARD_KEY);
      }
      return false;
    }

    // SCENARIO 2: Token Present but Expired
    const handshakeTs = (session as any)._handshake_ts || 0;
    const ageMins = (Date.now() - handshakeTs) / (1000 * 60);

    if (ageMins > 55) {
      logSystemEvent("[BRIDGE] Signal expired. Refreshing handshake.");
      localStorage.setItem(HANDSHAKE_GUARD_KEY, Date.now().toString());
      
      try {
        await signInWithGoogle(); // Redirect for new token
      } catch (e) {
        logSystemEvent("[BRIDGE] Recovery failed.", "error");
        localStorage.removeItem(HANDSHAKE_GUARD_KEY);
      }
      return false; 
    }
    
    return true;
  },

  continueAsGuest: () => {
    // Deprecated: No-op or temporary redirect
    console.warn("Guest mode disabled.");
  },

  fetchProfile: async () => {
    const { isSupabaseActive, session } = get();
    if (!isSupabaseActive || !session?.user) return;
    try {
      const { data } = await supabase.from('profiles').select('is_pro, full_name, avatar_url').eq('id', session.user.id).maybeSingle();
      if (data) {
        set({ userProfile: { id: session.user.id, full_name: data.full_name || '', avatar_url: data.avatar_url || '', is_pro: !!data.is_pro, updated_at: new Date().toISOString() } });
      }
    } catch (err: any) {}
  },

  upgradeToPro: async () => {
    const { session, isSupabaseActive, addToast } = get();
    if (!session?.user) return;
    set(state => ({ userProfile: state.userProfile ? { ...state.userProfile, is_pro: true } : null }));
    if (isSupabaseActive) {
      await supabase.from('profiles').update({ is_pro: true }).eq('id', session.user.id);
    }
    addToast("Executive Tier Active.", "success");
  },

  signOut: async () => {
    const { isSupabaseActive } = get();
    try {
      if (isSupabaseActive) await supabaseSignOut();
    } catch (e) {
    } finally {
      localStorage.clear();
      set({ session: null, userProfile: null, isGuest: false, insights: [], view: AppView.DASHBOARD });
      window.location.reload();
    }
  },
});
