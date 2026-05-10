import { describe, it, expect, beforeEach, vi } from 'vitest';
import useProfileStore from '../profileStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }
}));

describe('profileStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProfileStore.setState({
      stats: null,
      achievements: [],
      loading: false,
      lastFetched: null,
    });
  });

  describe('fetch', () => {
    it('should handle unauthenticated user', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();
      expect(state.stats).toBeNull();
      expect(state.achievements).toEqual([]);
      expect(state.loading).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch profile stats and achievements for authenticated user', async () => {
      const mockUser = { id: 'user123' };
      const mockLogs = [{ id: 1, score: 80 }, { id: 2, score: 90 }, { id: 3, score: 0 }];
      const mockAchievements = [{ achievement: 'First Log' }, { achievement: 'Perfect Score' }];

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockLogsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockLogs, error: null })
      };
      const mockAchievementsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockAchievements, error: null })
      };

      supabase.from.mockImplementation((table) => {
        if (table === 'experiment_logs') return mockLogsQuery;
        if (table === 'achievements') return mockAchievementsQuery;
        return { select: vi.fn().mockReturnThis() };
      });

      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();

      expect(state.stats).toEqual({
        total_experiments: 3,
        avg_accuracy: 85, // (80 + 90) / 2
        best_score: 90,
        total_xp: 150 // 3 * 50
      });
      expect(state.achievements).toEqual(['First Log', 'Perfect Score']);
      expect(state.loading).toBe(false);
      expect(state.lastFetched).toBeDefined();

      expect(supabase.from).toHaveBeenCalledWith('experiment_logs');
      expect(supabase.from).toHaveBeenCalledWith('achievements');
      expect(mockLogsQuery.eq).toHaveBeenCalledWith('student_id', mockUser.id);
      expect(mockAchievementsQuery.eq).toHaveBeenCalledWith('student_id', mockUser.id);
    });

    it('should handle empty logs correctly', async () => {
      const mockUser = { id: 'user123' };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockLogsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      };
      const mockAchievementsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      supabase.from.mockImplementation((table) => {
        if (table === 'experiment_logs') return mockLogsQuery;
        if (table === 'achievements') return mockAchievementsQuery;
        return { select: vi.fn().mockReturnThis() };
      });

      await useProfileStore.getState().fetch();

      const state = useProfileStore.getState();

      expect(state.stats).toEqual({
        total_experiments: 0,
        avg_accuracy: 0,
        best_score: 0,
        total_xp: 0
      });
      expect(state.achievements).toEqual([]);
      expect(state.loading).toBe(false);
    });

    it('should use cache if fetched recently', async () => {
      const mockUser = { id: 'user123' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      useProfileStore.setState({ lastFetched: Date.now() });

      await useProfileStore.getState().fetch();

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should clear lastFetched and call fetch', async () => {
      useProfileStore.setState({ lastFetched: 123456789 });

      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useProfileStore.getState().refresh();

      const state = useProfileStore.getState();
      expect(state.lastFetched).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset store state', () => {
      useProfileStore.setState({
        stats: { xp: 100 },
        achievements: ['Badge'],
        loading: true,
        lastFetched: 123,
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
