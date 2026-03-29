import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    useProfileStore.setState({ stats: null, achievements: [], loading: false, lastFetched: null });
    vi.clearAllMocks();
  });

  it('calculates average score including 0s', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } } });

    supabase.from.mockImplementation((table) => {
      if (table === 'experiment_logs') {
        return {
          select: () => ({
            eq: () => Promise.resolve({
              data: [
                { score: 100 },
                { score: 0 },
                { score: 50 }
              ]
            })
          })
        };
      }
      if (table === 'achievements') {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [] })
          })
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [] })
      };
    });

    await useProfileStore.getState().fetch();
    const state = useProfileStore.getState();

    // Total is 3, scores are 100, 0, 50. Average should be 50.
    expect(state.stats.avg_accuracy).toBe(50);
  });
});
