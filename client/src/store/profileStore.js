/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useProfileStore = create((set, get) => ({
  stats: null,
  achievements: [],
  loading: false,
  lastFetched: null,

  fetch: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ stats: null, achievements: [], loading: false });
      return;
    }

    const now = Date.now();
    if (get().lastFetched && now - get().lastFetched < 60000) {
      return;
    }

    set({ loading: true });

    const [logsResult, achievementsResult] = await Promise.all([
      supabase
        .from('experiment_logs')
        .select('*')
        .eq('student_id', user.id),
      supabase
        .from('achievements')
        .select('*')
        .eq('student_id', user.id),
    ]);

    const logs = logsResult.data || [];
    const total = logs.length;
    const scores = logs.map(l => l.score || 0).filter(s => s > 0);
    const avgAccuracy = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const xp = total * 50;

    set({
      stats: { 
        total_experiments: total, 
        avg_accuracy: avgAccuracy, 
        best_score: bestScore, 
        total_xp: xp 
      },
      achievements: (achievementsResult.data || []).map(a => a.achievement),
      loading: false,
      lastFetched: now,
    });
  },

  refresh: async () => {
    set({ lastFetched: null });
    await get().fetch();
  },

  reset: () => set({ stats: null, achievements: [], loading: false, lastFetched: null }),
}));

export default useProfileStore;
