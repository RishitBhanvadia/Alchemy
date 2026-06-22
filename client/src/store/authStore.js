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
    
    // Dynamically import stores to reset them on logout — avoids circular deps
    try {
      const { default: labStore } = await import('./labStore');
      labStore.getState().reset();
    } catch (_) { /* store not available */ }
    
    try {
      const { default: historyStore } = await import('./historyStore');
      historyStore.getState().reset();
    } catch (_) { /* store not available */ }
    
    try {
      const { default: profileStore } = await import('./profileStore');
      profileStore.getState().reset();
    } catch (_) { /* store not available */ }
    
    try {
      const { default: classroomStore } = await import('./classroomStore');
      classroomStore.getState().reset();
    } catch (_) { /* store not available */ }
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
      // Profile not found — create one (fallback if trigger didn't fire)
      const profilePayload = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        role: user.user_metadata?.role || 'student',
        avatar_url: user.user_metadata?.avatar_url || null,
      };
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profilePayload)
        .select()
        .single();
      
      if (insertError) {
        // eslint-disable-next-line no-console
        console.error('[authStore] Failed to create profile:', insertError.message, insertError.code);
        return null;
      }
      return newProfile;
    }
    
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[authStore] Profile fetch error:', error.message, error.code);
    }
    
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[authStore] fetchProfile exception:', err.message);
    return null;
  }
}

export default useAuthStore;
