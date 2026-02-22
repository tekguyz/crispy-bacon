
import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { supabase } from '../services/supabaseClient';
import { queryClient } from '../lib/queryClient';

export const createDataItemSlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  deleteInsight: async (id) => {
    const { addToast, selectedInsight, setSelectedInsight } = get();
    
    if (selectedInsight?.id === id) {
       setSelectedInsight(null);
    }

    const now = new Date().toISOString();
    
    // CRITICAL FIX: Kill local artifact immediately.
    // If this item was failing to sync (Zombie), this stops the background loop.
    try { 
      const { deleteArtifactLocally } = await import('../services/localDbService');
      await deleteArtifactLocally(id); 
    } catch(e) { console.warn("Local kill drift:", e); }

    try {
      await supabase.from('insights').update({ deleted_at: now, updated_at: now }).eq('id', id);
      addToast("Moved to Trash.");
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {
      console.error("Trash failed:", e);
    }
  },

  deleteInsightForever: async (id) => {
    const { addToast, selectedInsight, setSelectedInsight } = get();
    
    if (selectedInsight?.id === id) {
       setSelectedInsight(null);
    }

    try {
      // 1. Purge from cloud storage
      // We need to fetch the item first to get the storage path, or just try to delete blindly if we don't have it.
      // Since we don't have 'insights' in store, we might skip storage delete if we don't fetch it first.
      // But for now, let's rely on Supabase to handle the DB delete.
      // Ideally we should fetch the item to get storage_path.
      const { data: item } = await supabase.from('insights').select('storage_path').eq('id', id).single();

      if (item?.storage_path) {
        await supabase.storage.from('meetings').remove([item.storage_path]);
      }
      
      // 2. Purge from local IndexedDB
      const { deleteArtifactLocally } = await import('../services/localDbService');
      await deleteArtifactLocally(id);

      // 3. Purge from database
      await supabase.from('insights').delete().eq('id', id);
      
      addToast("Permanently removed.");
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {
      console.error("Permanent delete failed:", e);
    }
  },

  restoreInsight: async (id) => {
    const { addToast } = get();
    const now = new Date().toISOString();

    try {
      await supabase.from('insights').update({ deleted_at: null, updated_at: now }).eq('id', id);
      addToast("Restored from Trash.");
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {}
  },

  bulkDelete: async (ids) => {
    const { addToast, clearSelection } = get();
    const now = new Date().toISOString();
    
    clearSelection();

    // Kill all selected locals to stop any sync storms
    const { deleteArtifactLocally } = await import('../services/localDbService');
    for (const id of ids) {
       try { await deleteArtifactLocally(id); } catch(e) {}
    }

    try {
      await supabase.from('insights').update({ deleted_at: now, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items moved to Trash.`);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {}
  },

  bulkArchive: async (ids, archive) => {
    const { addToast, clearSelection } = get();
    const now = new Date().toISOString();
    clearSelection();
    try {
      await supabase.from('insights').update({ is_archived: archive, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items ${archive ? 'archived' : 'restored'}.`);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {}
  },

  bulkPin: async (ids, pin) => {
    const { addToast, clearSelection } = get();
    const now = new Date().toISOString();
    clearSelection();
    try {
      await supabase.from('insights').update({ is_favorite: pin, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items ${pin ? 'pinned' : 'unpinned'}.`);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {}
  },

  bulkRestore: async (ids) => {
    const { addToast, clearSelection } = get();
    const now = new Date().toISOString();
    clearSelection();
    try {
      await supabase.from('insights').update({ deleted_at: null, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items restored.`);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {}
  },

  bulkDeleteForever: async (ids) => {
    const { addToast, clearSelection } = get();
    
    clearSelection();
    
    try {
      // Fetch items to get storage paths
      const { data: items } = await supabase.from('insights').select('id, storage_path').in('id', ids);
      
      const paths = items?.map(i => i.storage_path).filter(Boolean) as string[] || [];
      if (paths.length > 0) {
        await supabase.storage.from('meetings').remove(paths);
      }

      const { deleteArtifactLocally } = await import('../services/localDbService');
      for (const id of ids) {
        await deleteArtifactLocally(id);
      }

      await supabase.from('insights').delete().in('id', ids);
      
      addToast(`${ids.length} items purged.`);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    } catch (e) {
      console.error("Bulk purge failed:", e);
    }
  },

  toggleFavorite: async (id) => {
    // We need to fetch the current state to toggle it, or just send the new value if we knew it.
    // Since we don't have the item in store, we can't easily toggle without fetching or passing the current value.
    // Ideally the UI passes the current value or we fetch it.
    // For now, let's assume the UI will handle the toggle logic or we fetch it.
    // Actually, the UI calls this. But the UI has the data from React Query.
    // It would be better if this action took the new value instead of toggling.
    // But to avoid breaking the interface, let's fetch it first.
    
    const { data: insight } = await supabase.from('insights').select('is_favorite').eq('id', id).single();
    if (!insight) return;
    
    const val = !insight.is_favorite;
    const now = new Date().toISOString();
    
    // Optimistic update for selectedInsight if it matches
    const { selectedInsight, setSelectedInsight } = get();
    if (selectedInsight?.id === id) {
        setSelectedInsight({ ...selectedInsight, is_favorite: val });
    }

    await supabase.from('insights').update({ is_favorite: val, updated_at: now }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  },

  toggleArchive: async (id) => {
    const { data: insight } = await supabase.from('insights').select('is_archived').eq('id', id).single();
    if (!insight) return;

    const val = !insight.is_archived;
    const now = new Date().toISOString();

    const { selectedInsight, setSelectedInsight } = get();
    if (selectedInsight?.id === id) {
        setSelectedInsight({ ...selectedInsight, is_archived: val });
    }

    await supabase.from('insights').update({ is_archived: val, updated_at: now }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  },

  toggleActionItemComplete: async (id, index) => {
    // This one is tricky because we need the array index.
    // We must fetch the current metadata.
    const { data: insight } = await supabase.from('insights').select('metadata').eq('id', id).single();
    if (!insight) return;

    const current = insight.metadata?.completedActionIndices || [];
    const updated = current.includes(index) ? current.filter((i: number) => i !== index) : [...current, index];
    const metadata = { ...(insight.metadata || {}), completedActionIndices: updated };
    const now = new Date().toISOString();
    
    const { selectedInsight, setSelectedInsight } = get();
    if (selectedInsight?.id === id) {
        setSelectedInsight({ ...selectedInsight, metadata });
    }
    
    await supabase.from('insights').update({ metadata, updated_at: now }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['insights'] });

    try {
      await supabase
        .from('shared_links')
        .update({ completed_indices: updated })
        .eq('insight_id', id) 
        .eq('is_collaborative', true);
    } catch (shareErr) {
      console.warn("[Sync] Shared link update deferred.");
    }
  }
});
