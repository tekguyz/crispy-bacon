import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { fetchHybridInsights, fetchUserCollections, fetchUserTags } from '../services/repository';

export const useInsightsQuery = () => {
  const session = useAppStore(s => s.session);
  const isSupabaseActive = useAppStore(s => s.isSupabaseActive);
  const isGuest = useAppStore(s => s.isGuest);

  return useQuery({
    queryKey: ['insights', session?.user?.id],
    queryFn: () => fetchHybridInsights(session?.user?.id, isSupabaseActive),
    enabled: !!session?.user?.id || isGuest, // Only run if logged in or explicitly guest
    staleTime: 1000 * 60 * 2, // Consider fresh for 2 minutes
  });
};

export const useCollectionsQuery = () => {
  const session = useAppStore(s => s.session);
  return useQuery({
    queryKey: ['collections', session?.user?.id],
    queryFn: () => fetchUserCollections(session?.user?.id),
    enabled: !!session?.user?.id,
  });
};

export const useTagsQuery = () => {
  const session = useAppStore(s => s.session);
  return useQuery({
    queryKey: ['tags', session?.user?.id],
    queryFn: () => fetchUserTags(session?.user?.id),
    enabled: !!session?.user?.id,
  });
};