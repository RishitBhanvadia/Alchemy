import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
        })),
      })),
    })),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it('should handle logout', async () => {
    useAuthStore.setState({ user: { id: 'mock-id' } });
    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
