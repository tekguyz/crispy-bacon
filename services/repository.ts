
import { supabase, getCollections, getTags } from './supabaseClient';
import { getAllLocalArtifacts, SyncStatus, pruneLocalStorage } from './localDbService';
import { mapSupabaseToInsight } from './dataTransformers';
import { ContentType, ProcessingStatus } from '../types';

/**
 * REPOSITORY LAYER
 * Handles the raw fetching logic, decoupling it from the State Store.
 */

export const fetchHybridInsights = async (userId: string | undefined, isSupabaseActive: boolean) => {
  // 1. Maintenance: Prune old blobs
  await pruneLocalStorage();

  // 2. Fetch Local Artifacts (Offline First) - METADATA ONLY (False flag)
  const localArtifacts = await getAllLocalArtifacts(false);
  
  const localItems = localArtifacts.map(art => ({
      id: art.id,
      title: art.metadata.title || "Local Research Note",
      created_at: new Date(art.timestamp).toISOString(),
      type: ContentType.MEETING,
      processing_status: art.sync_status === SyncStatus.SYNCED ? ProcessingStatus.COMPLETED : ProcessingStatus.LOCAL,
      summary: art.sync_status === SyncStatus.UNSYNCED ? "Secured locally." : "Verified.",
      metadata: { ...art.metadata, is_local: true, version: art.version }
  }));

  // 3. If Guest or Offline, return local only
  if (!isSupabaseActive || !userId) {
      return localItems as any[];
  }

  // 4. Fetch Remote Data
  const { data: itemsData, error } = await supabase
    .from('insights')
    .select(`
      *, 
      summaries(*), 
      insight_collections(collections(*)), 
      insight_tags(tags(*))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  const remoteInsights = (itemsData || []).map(mapSupabaseToInsight);
  
  // 5. Merge Strategy: Remote takes precedence, Local fills gaps
  const combined = [...remoteInsights];
  localItems.forEach(li => { 
    if (combined.findIndex(ri => ri.id === li.id) === -1) {
        combined.unshift(li as any); 
    }
  });

  return combined;
};

export const fetchUserCollections = async (userId: string | undefined) => {
    if (!userId) return [];
    return await getCollections(userId);
};

export const fetchUserTags = async (userId: string | undefined) => {
    if (!userId) return [];
    return await getTags(userId);
};
