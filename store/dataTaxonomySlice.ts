import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { v4 as uuidv4 } from 'uuid';
import { 
  supabase, createCollection, updateCollection, deleteCollection,
  createTag, updateTag, deleteTag, addItemToCollection, removeItemFromCollection,
  addTagToItem, removeTagFromItem, handleSupabaseError
} from '../services/supabaseClient';

export const createDataTaxonomySlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  createCollectionAction: async (name) => {
    const { session, isSupabaseActive, addToast } = get();
    if (!session?.user) return;
    if (isSupabaseActive) {
      try {
        const newCol = await createCollection(session.user.id, name);
        if (newCol) set(s => ({ collections: [...s.collections, newCol].sort((a,b) => a.name.localeCompare(b.name)) }));
      } catch (err) { handleSupabaseError(err, addToast); }
    } else {
      const localCol = { id: uuidv4(), user_id: session.user.id, name, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      set(s => ({ collections: [...s.collections, localCol].sort((a,b) => a.name.localeCompare(b.name)) }));
    }
  },

  updateCollectionAction: async (id, name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try {
        const updated = await updateCollection(id, name);
        if (updated) set(s => ({ collections: s.collections.map(c => c.id === id ? updated : c) }));
      } catch (err) { handleSupabaseError(err, addToast); }
    } else {
      set(s => ({ collections: s.collections.map(c => c.id === id ? { ...c, name, updated_at: new Date().toISOString() } : c) }));
    }
  },

  deleteCollectionAction: async (id, _name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { await deleteCollection(id); } catch (err) { handleSupabaseError(err, addToast); }
    }
    set(s => ({ collections: s.collections.filter(c => c.id !== id) }));
  },

  addItemToCollectionAction: async (itemId, collectionId) => {
    const { isSupabaseActive, addToast, collections } = get();
    if (isSupabaseActive) {
      try { await supabase.from('insight_collections').insert({ insight_id: itemId, collection_id: collectionId }); } 
      catch (err) { handleSupabaseError(err, addToast); return; }
    }
    const col = collections.find(c => c.id === collectionId);
    if (!col) return;
    set(s => {
      const insights = s.insights.map(i => i.id === itemId ? { ...i, collections: [...(i.collections || []), col] } : i);
      return { insights, selectedInsight: s.selectedInsight?.id === itemId ? insights.find(i => i.id === itemId) || null : s.selectedInsight };
    });
  },

  removeItemFromCollectionAction: async (itemId, collectionId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { await supabase.from('insight_collections').delete().eq('insight_id', itemId).eq('collection_id', collectionId); } 
      catch (err) { handleSupabaseError(err, addToast); return; }
    }
    set(s => {
      const insights = s.insights.map(i => i.id === itemId ? { ...i, collections: i.collections?.filter(c => c.id !== collectionId) } : i);
      return { insights, selectedInsight: s.selectedInsight?.id === itemId ? insights.find(i => i.id === itemId) || null : s.selectedInsight };
    });
  },

  createTagAction: async (name) => {
    const { session, isSupabaseActive, addToast } = get();
    if (!session?.user) return;
    if (isSupabaseActive) {
      try {
        const newTag = await createTag(session.user.id, name);
        if (newTag) set(s => ({ tags: [...s.tags, newTag] }));
      } catch (err) { handleSupabaseError(err, addToast); }
    } else {
      const localTag = { id: uuidv4(), user_id: session.user.id, name, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      set(s => ({ tags: [...s.tags, localTag] }));
    }
  },

  updateTagAction: async (id, name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try {
        const updated = await updateTag(id, name);
        if (updated) set(s => ({ tags: s.tags.map(t => t.id === id ? updated : t) }));
      } catch (err) { handleSupabaseError(err, addToast); }
    } else {
      set(s => ({ tags: s.tags.map(t => t.id === id ? { ...t, name, updated_at: new Date().toISOString() } : t) }));
    }
  },

  deleteTagAction: async (id, _name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { await deleteTag(id); } catch (err) { handleSupabaseError(err, addToast); }
    }
    set(s => ({ tags: s.tags.filter(t => t.id !== id) }));
  },

  addTagToItemAction: async (itemId, tagId) => {
    const { isSupabaseActive, addToast, tags } = get();
    if (isSupabaseActive) {
      try { await supabase.from('insight_tags').insert({ insight_id: itemId, tag_id: tagId }); } catch (err) { handleSupabaseError(err, addToast); return; }
    }
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;
    set(s => {
      const insights = s.insights.map(i => i.id === itemId ? { ...i, tags: [...(i.tags || []), tag] } : i);
      return { insights, selectedInsight: s.selectedInsight?.id === itemId ? insights.find(i => i.id === itemId) || null : s.selectedInsight };
    });
  },

  removeTagFromItemAction: async (itemId, tagId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { await supabase.from('insight_tags').delete().eq('insight_id', itemId).eq('tag_id', tagId); } catch (err) { handleSupabaseError(err, addToast); return; }
    }
    set(s => {
      const insights = s.insights.map(i => i.id === itemId ? { ...i, tags: i.tags?.filter(t => t.id !== tagId) } : i);
      return { insights, selectedInsight: s.selectedInsight?.id === itemId ? insights.find(i => i.id === itemId) || null : s.selectedInsight };
    });
  },
});