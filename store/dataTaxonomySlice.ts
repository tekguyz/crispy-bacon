import { StateCreator } from 'zustand';
import { AppState, DataSlice } from './types';
import { v4 as uuidv4 } from 'uuid';
import { 
  supabase, createCollection, updateCollection, deleteCollection,
  createTag, updateTag, deleteTag, handleSupabaseError
} from '../services/supabaseClient';
import { queryClient } from '../lib/queryClient';

export const createDataTaxonomySlice: StateCreator<AppState, [], [], Partial<DataSlice>> = (set, get) => ({
  createCollectionAction: async (name) => {
    const { session, isSupabaseActive, addToast } = get();
    if (!session?.user) return;
    if (isSupabaseActive) {
      try {
        await createCollection(session.user.id, name);
        queryClient.invalidateQueries({ queryKey: ['collections'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    } else {
      // Local mode not supported for now as we removed local state
      addToast("Online mode required for collections.", "info");
    }
  },

  updateCollectionAction: async (id, name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try {
        await updateCollection(id, name);
        queryClient.invalidateQueries({ queryKey: ['collections'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    }
  },

  deleteCollectionAction: async (id, _name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await deleteCollection(id); 
        queryClient.invalidateQueries({ queryKey: ['collections'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    }
  },

  addItemToCollectionAction: async (itemId, collectionId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await supabase.from('insight_collections').insert({ insight_id: itemId, collection_id: collectionId }); 
        queryClient.invalidateQueries({ queryKey: ['insights'] });
      } 
      catch (err) { handleSupabaseError(err, addToast); return; }
    }
  },

  removeItemFromCollectionAction: async (itemId, collectionId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await supabase.from('insight_collections').delete().eq('insight_id', itemId).eq('collection_id', collectionId); 
        queryClient.invalidateQueries({ queryKey: ['insights'] });
      } 
      catch (err) { handleSupabaseError(err, addToast); return; }
    }
  },

  createTagAction: async (name) => {
    const { session, isSupabaseActive, addToast } = get();
    if (!session?.user) return;
    if (isSupabaseActive) {
      try {
        await createTag(session.user.id, name);
        queryClient.invalidateQueries({ queryKey: ['tags'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    }
  },

  updateTagAction: async (id, name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try {
        await updateTag(id, name);
        queryClient.invalidateQueries({ queryKey: ['tags'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    }
  },

  deleteTagAction: async (id, _name) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await deleteTag(id); 
        queryClient.invalidateQueries({ queryKey: ['tags'] });
      } catch (err) { handleSupabaseError(err, addToast); }
    }
  },

  addTagToItemAction: async (itemId, tagId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await supabase.from('insight_tags').insert({ insight_id: itemId, tag_id: tagId }); 
        queryClient.invalidateQueries({ queryKey: ['insights'] });
      } catch (err) { handleSupabaseError(err, addToast); return; }
    }
  },

  removeTagFromItemAction: async (itemId, tagId) => {
    const { isSupabaseActive, addToast } = get();
    if (isSupabaseActive) {
      try { 
        await supabase.from('insight_tags').delete().eq('insight_id', itemId).eq('tag_id', tagId); 
        queryClient.invalidateQueries({ queryKey: ['insights'] });
      } catch (err) { handleSupabaseError(err, addToast); return; }
    }
  },
});