import { describe, it, expect, vi, beforeEach } from 'vitest';
import useProfileStore from '../profileStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [] }),
    })),
  },
}));

describe('profileStore', () => {
  beforeEach(() => {
    useProfileStore.getState().reset();
    vi.clearAllMocks();
  });

  it('calculates average accuracy correctly including zero scores', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

    // Mock 3 experiments: 100, 0, 50. Average should be 50.
    supabase.from.mockImplementation((table) => {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation((field, val) => {
          if (table === 'experiment_logs') {
            return Promise.resolve({ data: [{ score: 100 }, { score: 0 }, { score: 50 }] });
          }
          return Promise.resolve({ data: [] });
        }),
      };
    });

    await useProfileStore.getState().fetch();
    const stats = useProfileStore.getState().stats;
    expect(stats.avg_accuracy).toBe(50);
  });
});
