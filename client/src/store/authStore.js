import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const handleSession = async (session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          set({ 
            user: session.user, 
            profile, 
            session, 
            loading: false, 
            error: profile ? null : 'Profile not found' 
          });
        } else {
          set({ user: null, profile: null, session: null, loading: false, error: null });
        }
      };

      await handleSession(session);

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          get().logout();
          window.location.href = '/login';
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profile = await fetchProfile(session.user);
            set({ user: session.user, profile, session });
          }
        }
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null, loading: false, error: null });
    
    if (typeof useLabStore !== 'undefined') {
      useLabStore.getState().reset();
    }
    if (typeof useHistoryStore !== 'undefined') {
      useHistoryStore.getState().reset();
    }
    if (typeof useProfileStore !== 'undefined') {
      useProfileStore.getState().reset();
    }
    if (typeof useClassroomStore !== 'undefined') {
      useClassroomStore.getState().reset();
    }
  },

  refreshProfile: async () => {
    const userId = get().user?.id;
    if (!userId) return;
    
    const profile = await fetchProfile({ id: userId, user_metadata: get().user?.user_metadata });
    if (profile) {
      set({ profile });
    }
  },
}));

async function fetchProfile(user) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      return data;
    }
    
    if (error?.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
          role: user.user_metadata?.role || 'student',
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();
      
      if (insertError) {
        return null;
      }
      return newProfile;
    }
    
    return null;
  } catch (err) {
    return null;
  }
}

let useLabStore, useHistoryStore, useProfileStore, useClassroomStore;

try {
  useLabStore = require('./labStore').default;
  useHistoryStore = require('./historyStore').default;
  useProfileStore = require('./profileStore').default;
  useClassroomStore = require('./classroomStore').default;
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Store imports deferred - stores may not be initialized yet');
}

export default useAuthStore;
