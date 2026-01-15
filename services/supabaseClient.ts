
import { createClient } from '@supabase/supabase-js';
import { Collection, Tag } from '../types';

const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
    if (typeof process !== 'undefined' && process.env) {
      const val = (process.env as any)[key];
      if (val) return val;
    }
  } catch (e) {}
  return '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_DATABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[Architect] Supabase credentials missing. Signal local-only.");
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'crispy-bacon-auth'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'placeholder';
};

export const handleSupabaseError = (error: any, addToast: (msg: string, type: any) => void, customMessage?: string) => {
  console.error("Supabase Error:", error);
  if (error?.message === 'JSON object requested, multiple (or no) rows returned') return;
  addToast(customMessage || error.message || "Operation failed", "error");
};

// --- AUTH METHODS ---

export const signInWithGoogle = async () => {
  const { data, error } = await (supabase.auth as any).signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: { 
        access_type: 'offline', 
        prompt: 'consent' 
      },
      scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/drive.readonly'
    },
  });
  if (error) throw error;
  return data;
};

export const signInWithMicrosoft = async () => {
  const { data, error } = await (supabase.auth as any).signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: window.location.origin,
      scopes: 'email profile offline_access User.Read'
    },
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await (supabase.auth as any).signOut();
  if (error) throw error;
};

// --- DATA METHODS ---

export const createCollection = async (userId: string, name: string): Promise<Collection | null> => {
  const { data, error } = await supabase.from('collections').insert({ user_id: userId, name }).select().single();
  if (error) throw error;
  return data;
};

export const updateCollection = async (id: string, name: string): Promise<Collection | null> => {
  const { data, error } = await supabase.from('collections').update({ name, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCollection = async (id: string) => {
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
};

export const getCollections = async (userId: string): Promise<Collection[]> => {
  const { data, error } = await supabase.from('collections').select('*').eq('user_id', userId).order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createTag = async (userId: string, name: string): Promise<Tag | null> => {
  const { data, error } = await supabase.from('tags').insert({ user_id: userId, name }).select().single();
  if (error) throw error;
  return data;
};

export const updateTag = async (id: string, name: string): Promise<Tag | null> => {
  const { data, error } = await supabase.from('tags').update({ name, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteTag = async (id: string) => {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
};

export const getTags = async (userId: string): Promise<Tag[]> => {
  const { data, error } = await supabase.from('tags').select('*').eq('user_id', userId).order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const addItemToCollection = async (insightId: string, collectionId: string) => {
  const { error } = await supabase.from('insight_collections').insert({ insight_id: insightId, collection_id: collectionId });
  if (error) throw error;
};

export const removeItemFromCollection = async (insightId: string, collectionId: string) => {
  const { error } = await supabase.from('insight_collections').delete().eq('insight_id', insightId).eq('collection_id', collectionId);
  if (error) throw error;
};

export const addTagToItem = async (insightId: string, tagId: string) => {
  const { error } = await supabase.from('insight_tags').insert({ insight_id: insightId, tag_id: tagId });
  if (error) throw error;
};

export const removeTagFromItem = async (insightId: string, tagId: string) => {
  const { error } = await supabase.from('insight_tags').delete().eq('insight_id', insightId).eq('tag_id', tagId);
  if (error) throw error;
};
