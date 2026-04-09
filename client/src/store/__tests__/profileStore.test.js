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
    useProfileStore.setState({
      stats: null,
      achievements: [],
      loading: false,
      lastFetched: null,
    });
    vi.clearAllMocks();
  });

  it('includes 0 scores in average accuracy calculation', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    const mockEq = vi.fn().mockResolvedValue({
      data: [{ score: 100 }, { score: 50 }, { score: 0 }],
    });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useProfileStore.getState().fetch();

    // Total is 3, scores: 100, 50, 0 => sum is 150, avg is 50.
    // If 0 is filtered out, avg would be (100+50)/2 = 75.
    const state = useProfileStore.getState();
    expect(state.stats.avg_accuracy).toBe(50);
  });
});
