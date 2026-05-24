import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn().mockReturnThis(),
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

  it('initilizes with no user when session is empty', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('initializes and fetches profile when session has a user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student', full_name: 'Test' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    supabase.single.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
  });

  it('logout clears state and calls signOut', async () => {
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: {},
      loading: false,
    });

    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
