import { describe, it, expect, beforeEach, vi } from 'vitest';
import useProfileStore from '../profileStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('profileStore', () => {
  beforeEach(() => {
    useProfileStore.setState({
      stats: null,
      achievements: [],
      loading: false,
      lastFetched: null,
    });
    vi.clearAllMocks();
  });

  it('has initial default state', () => {
    const state = useProfileStore.getState();
    expect(state.stats).toBeNull();
    expect(state.achievements).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.lastFetched).toBeNull();
  });

  describe('fetch', () => {
    it('does not fetch if user is not logged in', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();
      expect(state.stats).toBeNull();
      expect(state.achievements).toEqual([]);
      expect(state.loading).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('skips fetch if lastFetched is recent', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
      useProfileStore.setState({ lastFetched: Date.now() - 10000 }); // 10 seconds ago

      await useProfileStore.getState().fetch();

      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('fetches profile and calculates stats correctly', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

      const mockLogs = [
        { id: '1', score: 90 },
        { id: '2', score: 80 },
        { id: '3', score: 0 } // should be filtered out from avg
      ];

      const mockAchievements = [
        { achievement: 'First Experiment' },
        { achievement: 'Perfect Score' }
      ];

      const logsSelectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockLogs, error: null })
      });

      const achievementsSelectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockAchievements, error: null })
      });

      supabase.from.mockImplementation((table) => {
        if (table === 'experiment_logs') return { select: logsSelectMock };
        if (table === 'achievements') return { select: achievementsSelectMock };
        return {};
      });

      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();

      expect(state.loading).toBe(false);
      expect(state.achievements).toEqual(['First Experiment', 'Perfect Score']);

      // Check stats calculations
      // total = 3
      // avg = (90 + 80) / 2 = 85
      // best = 90
      // xp = 3 * 50 = 150
      expect(state.stats).toEqual({
        total_experiments: 3,
        avg_accuracy: 85,
        best_score: 90,
        total_xp: 150
      });

      expect(state.lastFetched).toBeGreaterThan(0);
    });

    it('handles empty results gracefully', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

      const emptySelectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null })
      });

      supabase.from.mockReturnValue({ select: emptySelectMock });

      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();

      expect(state.stats).toEqual({
        total_experiments: 0,
        avg_accuracy: 0,
        best_score: 0,
        total_xp: 0
      });
      expect(state.achievements).toEqual([]);
    });
  });

  describe('refresh', () => {
    it('forces a fetch by clearing lastFetched', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

      const emptySelectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null })
      });

      supabase.from.mockReturnValue({ select: emptySelectMock });

      useProfileStore.setState({ lastFetched: Date.now() - 10000 }); // 10 seconds ago

      await useProfileStore.getState().refresh();

      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('resets state to defaults', () => {
      useProfileStore.setState({
        stats: { xp: 100 },
        achievements: ['First'],
        loading: true,
        lastFetched: 12345,
      });

      useProfileStore.getState().reset();

      const state = useProfileStore.getState();
      expect(state.stats).toBeNull();
      expect(state.achievements).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.lastFetched).toBeNull();
    });
  });
});
