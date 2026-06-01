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
    from: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
  });

  it('should initialize with session and profile', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-1', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.session).toEqual(mockSession);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logout', async () => {
    supabase.auth.signOut.mockResolvedValue();

    useAuthStore.setState({
      user: { id: 'user-1' },
      profile: { id: 'user-1' },
      session: { user: { id: 'user-1' } },
      loading: false,
      error: null,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should fallback to creating a profile if PGRST116 is thrown', async () => {
    const mockUser = { id: 'user-2', email: 'fallback@example.com' };
    const mockSession = { user: mockUser };
    const expectedProfile = { id: 'user-2', full_name: 'fallback', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // First, simulate profile fetch failure with PGRST116
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }) // First call: select().single() fails
      .mockResolvedValueOnce({ data: expectedProfile, error: null }); // Second call: insert().single() succeeds

    const mockInsert = vi.fn().mockReturnThis();

    supabase.from.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      insert: mockInsert,
      single: mockSingle,
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(expectedProfile);
    expect(mockInsert).toHaveBeenCalledWith({
      id: mockUser.id,
      full_name: 'fallback',
      display_name: 'fallback',
      role: 'student',
      avatar_url: null,
    });
  });
});
