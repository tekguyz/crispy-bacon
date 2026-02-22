import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../services/supabaseClient';
import { InsightContent, ContentType, ProcessingStatus } from '../types';

const fetchHybridInsights = async (userId?: string, isSupabaseActive?: boolean): Promise<InsightContent[]> => {
  if (!userId) return [];

  let remoteInsights: InsightContent[] = [];
  
  if (isSupabaseActive) {
    const { data, error } = await supabase
      .from('insights')
      .select(`*, summaries(*), insight_collections(collections(*)), insight_tags(tags(*))`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const { mapSupabaseToInsight } = await import('../services/dataTransformers');
      remoteInsights = data.map(mapSupabaseToInsight);
    }
  }

  // Merge with local artifacts (offline/unsynced)
  const { getAllLocalArtifacts } = await import('../services/localDbService');
  const localArtifacts = await getAllLocalArtifacts();
  const localInsights: InsightContent[] = localArtifacts.map(art => ({
      id: art.id,
      user_id: userId,
      title: art.metadata?.title || "Untitled Draft",
      type: art.type as ContentType,
      created_at: new Date(art.timestamp).toISOString(),
      processing_status: ProcessingStatus.PENDING, // Assume pending if local only
      is_favorite: false,
      is_archived: false,
      original_content: "",
      metadata: art.metadata,
      summary: "",
      processed_text: "",
      highlights: [],
      topics: [],
      entities: [],
      action_items: [],
      sentiment: 'neutral' as any,
      collections: [],
      tags: [],
      storage_path: undefined,
      error_message: undefined
  }));

  // Deduplicate: Remote wins if IDs match
  const remoteIds = new Set(remoteInsights.map(i => i.id));
  const uniqueLocals = localInsights.filter(l => !remoteIds.has(l.id));

  return [...uniqueLocals, ...remoteInsights].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

const fetchUserCollections = async (userId?: string) => {
  if (!userId) return [];
  const { data } = await supabase.from('collections').select('*').eq('user_id', userId);
  return data || [];
};

const fetchUserTags = async (userId?: string) => {
  if (!userId) return [];
  const { data } = await supabase.from('tags').select('*').eq('user_id', userId);
  return data || [];
};

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

export const useCalendarQuery = () => {
  const session = useAppStore(s => s.session);
  const userProfile = useAppStore(s => s.userProfile);
  const ensureValidProviderToken = useAppStore(s => s.ensureValidProviderToken);

  return useQuery({
    queryKey: ['calendar', session?.user?.id],
    queryFn: async () => {
      if (!userProfile?.is_pro || !(await ensureValidProviderToken())) return [];
      const { getCalendarEvents } = await import('../services/googleBridge');
      return getCalendarEvents((session as any).provider_token);
    },
    enabled: !!session?.user?.id && !!userProfile?.is_pro,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDriveFilesQuery = () => {
  const session = useAppStore(s => s.session);
  const userProfile = useAppStore(s => s.userProfile);
  const ensureValidProviderToken = useAppStore(s => s.ensureValidProviderToken);

  return useQuery({
    queryKey: ['driveFiles', session?.user?.id],
    queryFn: async () => {
      if (!userProfile?.is_pro || !(await ensureValidProviderToken())) return [];
      const { listDriveFiles } = await import('../services/googleBridge');
      return listDriveFiles((session as any).provider_token);
    },
    enabled: !!session?.user?.id && !!userProfile?.is_pro,
    staleTime: 1000 * 60 * 5,
  });
};