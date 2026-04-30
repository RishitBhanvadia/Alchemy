import { describe, it, expect, beforeEach, vi } from 'vitest';
import useProfileStore from '../profileStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

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
    it('should set data to null/empty if not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useProfileStore.getState().fetch();

      expect(useProfileStore.getState().stats).toBeNull();
      expect(useProfileStore.getState().achievements).toEqual([]);
      expect(useProfileStore.getState().loading).toBe(false);
    });

    it('should not fetch if data was fetched recently', async () => {
       const mockUser = { id: 'student123' };
       supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

       const now = Date.now();
       useProfileStore.setState({ lastFetched: now - 30000 }); // Fetched 30s ago (within 60s limit)

       await useProfileStore.getState().fetch();

       expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch and calculate stats and achievements correctly', async () => {
        const mockUser = { id: 'student123' };
        supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

        const mockLogs = [
            { score: 80 },
            { score: 100 },
            { score: 0 }, // Should be ignored in score calculation
            { noScoreData: true } // Should be treated as 0 and ignored
        ];
        const mockAchievements = [{ achievement: 'First Blood' }, { achievement: 'Master Chemist' }];

        supabase.from.mockImplementation((table) => {
            if (table === 'experiment_logs') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockResolvedValue({ data: mockLogs })
                    })
                };
            }
            if (table === 'achievements') {
                return {
                     select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockResolvedValue({ data: mockAchievements })
                    })
                };
            }
        });

        await useProfileStore.getState().fetch();

        const state = useProfileStore.getState();
        expect(state.loading).toBe(false);
        expect(state.stats).toEqual({
             total_experiments: 4,
             avg_accuracy: 90, // (80 + 100) / 2
             best_score: 100,
             total_xp: 200 // 4 * 50
        });
        expect(state.achievements).toEqual(['First Blood', 'Master Chemist']);
        expect(state.lastFetched).toBeDefined();
    });

    it('should handle missing data gracefully', async () => {
        const mockUser = { id: 'student123' };
        supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

        supabase.from.mockImplementation((table) => {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: null })
                })
            };
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
    });
  });

  describe('refresh', () => {
      it('should clear lastFetched and fetch again', async () => {
          const fetchSpy = vi.spyOn(useProfileStore.getState(), 'fetch').mockResolvedValue();
          useProfileStore.setState({ lastFetched: Date.now() });

          await useProfileStore.getState().refresh();

          expect(useProfileStore.getState().lastFetched).toBeNull();
          expect(fetchSpy).toHaveBeenCalled();
      });
  });

  describe('reset', () => {
      it('should reset store to default values', () => {
          useProfileStore.setState({
              stats: { some: 'stats' },
              achievements: ['one'],
              loading: true,
              lastFetched: Date.now()
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
