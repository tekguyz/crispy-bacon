
import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { supabase } from '../services/supabaseClient';
import { deleteArtifactLocally } from '../services/localDbService';
import { ProcessingStatus } from '../types';

export const createDataItemSlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  deleteInsight: async (id) => {
    const { insights, addToast, selectedInsight, setSelectedInsight } = get();
    
    if (selectedInsight?.id === id) {
       setSelectedInsight(null);
    }

    const now = new Date().toISOString();

    set({ 
      insights: insights.map(i => i.id === id ? { ...i, deleted_at: now } : i) 
    });
    
    // CRITICAL FIX: Kill local artifact immediately.
    // If this item was failing to sync (Zombie), this stops the background loop.
    try { await deleteArtifactLocally(id); } catch(e) { console.warn("Local kill drift:", e); }

    try {
      await supabase.from('insights').update({ deleted_at: now, updated_at: now }).eq('id', id);
      addToast("Moved to Trash.");
    } catch (e) {
      console.error("Trash failed:", e);
    }
  },

  deleteInsightForever: async (id) => {
    const { insights, addToast, selectedInsight, setSelectedInsight } = get();
    const item = insights.find(i => i.id === id);
    
    if (selectedInsight?.id === id) {
       setSelectedInsight(null);
    }

    // Fix: Corrected filter condition by using 'id' instead of undefined 'ids'
    set({ insights: insights.filter(i => i.id !== id) });
    
    try {
      // 1. Purge from cloud storage
      if (item?.storage_path) {
        await supabase.storage.from('meetings').remove([item.storage_path]);
      }
      
      // 2. Purge from local IndexedDB
      await deleteArtifactLocally(id);

      // 3. Purge from database
      await supabase.from('insights').delete().eq('id', id);
      
      addToast("Permanently removed.");
    } catch (e) {
      console.error("Permanent delete failed:", e);
    }
  },

  restoreInsight: async (id) => {
    const { insights, addToast } = get();
    const item = insights.find(i => i.id === id);
    if (!item) return;

    const now = new Date().toISOString();
    set({ 
      insights: insights.map(i => i.id === id ? { ...i, deleted_at: null } : i) 
    });

    try {
      await supabase.from('insights').update({ deleted_at: null, updated_at: now }).eq('id', id);
      addToast("Restored from Trash.");
    } catch (e) {}
  },

  bulkDelete: async (ids) => {
    const { insights, addToast, clearSelection } = get();
    const now = new Date().toISOString();
    
    set({ insights: insights.map(i => ids.includes(i.id) ? { ...i, deleted_at: now } : i) });
    clearSelection();

    // Kill all selected locals to stop any sync storms
    for (const id of ids) {
       try { await deleteArtifactLocally(id); } catch(e) {}
    }

    try {
      await supabase.from('insights').update({ deleted_at: now, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items moved to Trash.`);
    } catch (e) {}
  },

  bulkArchive: async (ids, archive) => {
    const { insights, addToast, clearSelection } = get();
    const now = new Date().toISOString();
    set({ insights: insights.map(i => ids.includes(i.id) ? { ...i, is_archived: archive } : i) });
    clearSelection();
    try {
      await supabase.from('insights').update({ is_archived: archive, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items ${archive ? 'archived' : 'restored'}.`);
    } catch (e) {}
  },

  bulkPin: async (ids, pin) => {
    const { insights, addToast, clearSelection } = get();
    const now = new Date().toISOString();
    set({ insights: insights.map(i => ids.includes(i.id) ? { ...i, is_favorite: pin } : i) });
    clearSelection();
    try {
      await supabase.from('insights').update({ is_favorite: pin, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items ${pin ? 'pinned' : 'unpinned'}.`);
    } catch (e) {}
  },

  bulkRestore: async (ids) => {
    const { insights, addToast, clearSelection } = get();
    const now = new Date().toISOString();
    set({ insights: insights.map(i => ids.includes(i.id) ? { ...i, deleted_at: null } : i) });
    clearSelection();
    try {
      await supabase.from('insights').update({ deleted_at: null, updated_at: now }).in('id', ids);
      addToast(`${ids.length} items restored.`);
    } catch (e) {}
  },

  bulkDeleteForever: async (ids) => {
    const { insights, addToast, clearSelection } = get();
    const items = insights.filter(i => ids.includes(i.id));
    
    set({ insights: insights.filter(i => !ids.includes(i.id)) });
    clearSelection();
    
    try {
      const paths = items.map(i => i.storage_path).filter(Boolean) as string[];
      if (paths.length > 0) {
        await supabase.storage.from('meetings').remove(paths);
      }

      for (const id of ids) {
        await deleteArtifactLocally(id);
      }

      await supabase.from('insights').delete().in('id', ids);
      
      addToast(`${ids.length} items purged.`);
    } catch (e) {
      console.error("Bulk purge failed:", e);
    }
  },

  toggleFavorite: async (id) => {
    const insight = get().insights.find(i => i.id === id);
    if (!insight) return;
    const val = !insight.is_favorite;
    const now = new Date().toISOString();
    
    set(s => ({ 
      insights: s.insights.map(i => i.id === id ? { ...i, is_favorite: val } : i),
      selectedInsight: s.selectedInsight?.id === id ? { ...s.selectedInsight, is_favorite: val } : s.selectedInsight
    }));

    await supabase.from('insights').update({ is_favorite: val, updated_at: now }).eq('id', id);
  },

  toggleArchive: async (id) => {
    const insight = get().insights.find(i => i.id === id);
    if (!insight) return;
    const val = !insight.is_archived;
    const now = new Date().toISOString();

    set(s => ({ 
      insights: s.insights.map(i => i.id === id ? { ...i, is_archived: val } : i),
      selectedInsight: s.selectedInsight?.id === id ? { ...s.selectedInsight, is_archived: val } : s.selectedInsight
    }));

    await supabase.from('insights').update({ is_archived: val, updated_at: now }).eq('id', id);
  },

  toggleActionItemComplete: async (id, index) => {
    const insight = get().insights.find(i => i.id === id);
    if (!insight) return;
    const current = insight.metadata?.completedActionIndices || [];
    const updated = current.includes(index) ? current.filter(i => i !== index) : [...current, index];
    const metadata = { ...(insight.metadata || {}), completedActionIndices: updated };
    const now = new Date().toISOString();
    
    set(s => ({ 
      insights: s.insights.map(i => i.id === id ? { ...i, metadata } : i),
      selectedInsight: s.selectedInsight?.id === id ? { ...s.selectedInsight, metadata } : s.selectedInsight
    }));
    
    await supabase.from('insights').update({ metadata, updated_at: now }).eq('id', id);

    try {
      await supabase
        .from('shared_links')
        .update({ completed_indices: updated })
        // Aligned with new schema naming
        .eq('insight_id', id) 
        .eq('is_collaborative', true);
    } catch (shareErr) {
      console.warn("[Sync] Shared link update deferred.");
    }
  }
});
