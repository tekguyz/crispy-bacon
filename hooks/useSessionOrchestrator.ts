import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../services/supabaseClient';
import { queryClient } from '../lib/queryClient';

/**
 * useSessionOrchestrator v1.6.0
 * Updated for TanStack Query integration.
 * Manages background sync and realtime invalidation.
 */
export const useSessionOrchestrator = () => {
  const session = useAppStore(state => state.session);
  const isGuest = useAppStore(state => state.isGuest);
  const userProfile = useAppStore(state => state.userProfile);
  const authLoading = useAppStore(state => state.authLoading);
  const isAnalyzing = useAppStore(state => state.isAnalyzing);
  
  const initAuth = useAppStore(state => state.initAuth);
  // Note: fetchData is no longer called here, we let the query handle it via invalidation
  const fetchSingleInsight = useAppStore(state => state.fetchSingleInsight);
  const syncLocalQueue = useAppStore(state => state.syncLocalQueue);
  const setRealtimeStatus = useAppStore(state => state.setRealtimeStatus);
  const fetchPublicInsight = useAppStore(state => state.fetchPublicInsight);
  const ensureValidProviderToken = useAppStore(state => state.ensureValidProviderToken);

  const hasBooted = useRef(false);
  const lastHydratedUserId = useRef<string | null>(null);
  const heartbeatTimer = useRef<number | null>(null);

  // 1. Initial System Boot
  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;
    initAuth();
  }, [initAuth]);

  // 2. Data Hydration & Background Heartbeat
  useEffect(() => {
    const userId = session?.user?.id;
    const isPro = !!userProfile?.is_pro;

    const performSync = async () => {
        if (!userId && !isGuest) return;
        
        console.log("[Bridge] 📡 Triggering background sync pulse...");
        if (userId) {
            // Invalidate queries to trigger a refetch via React Query
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            
            await syncLocalQueue();
            
            // PRO Heartbeat: Keep Google data fresh
            if (isPro) {
                const tokenOk = await ensureValidProviderToken();
                if (tokenOk) {
                    queryClient.invalidateQueries({ queryKey: ['calendar'] });
                    queryClient.invalidateQueries({ queryKey: ['driveFiles'] });
                }
            }
        }
    };

    if ((userId && userId !== lastHydratedUserId.current) || (isGuest && lastHydratedUserId.current !== 'guest')) {
        lastHydratedUserId.current = userId || 'guest';
        performSync();

        if (heartbeatTimer.current) window.clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = window.setInterval(performSync, 10 * 60 * 1000);
    }

    return () => {
        if (heartbeatTimer.current) window.clearInterval(heartbeatTimer.current);
    };
  }, [session?.user?.id, isGuest, userProfile?.is_pro, syncLocalQueue, ensureValidProviderToken]);

  // 3. Realtime Subscription
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setRealtimeStatus('idle');
      return;
    }

    setRealtimeStatus('connecting');

    const channel = supabase
      .channel(`user-signals-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'insights', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.info("[Realtime] ⚡ Data Received:", payload.eventType);
          
          // Invalidate React Query cache to fetch fresh data
          queryClient.invalidateQueries({ queryKey: ['insights'] });

          const newItem = payload.new as any;
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (newItem?.id) fetchSingleInsight(newItem.id);
          }
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] 🟢 Subscription Status:", status);
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected');
        else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setRealtimeStatus('error');
      });

    return () => { 
      console.log("[Realtime] 🔴 Cleaning up data channel");
      supabase.removeChannel(channel); 
    };
  }, [session?.user?.id, fetchSingleInsight, setRealtimeStatus]);

  // 4. Deep Link Handlers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareSlug = params.get('share');
    if (shareSlug) fetchPublicInsight(shareSlug);
  }, [fetchPublicInsight]);

  return {
    isReady: !authLoading,
    isPro: !!userProfile?.is_pro,
    syncStatus: isAnalyzing ? 'syncing' : 'stable'
  };
};