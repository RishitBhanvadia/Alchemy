/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useHistoryStore = create((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetch: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ logs: [], loading: false });
      return;
    }

    const now = Date.now();
    if (get().lastFetched && now - get().lastFetched < 30000) {
      return;
    }

    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('experiment_logs')
      .select('*')
      .eq('student_id', user.id)
      .order('ran_at', { ascending: false })
      .limit(100);

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ logs: data || [], loading: false, lastFetched: now });
    }
  },

  refresh: async () => {
    set({ lastFetched: null });
    await get().fetch();
  },

  reset: () => set({ logs: [], loading: false, error: null, lastFetched: null }),
}));

export default useHistoryStore;
