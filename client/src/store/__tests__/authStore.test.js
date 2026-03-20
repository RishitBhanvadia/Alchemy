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

// Mock interdependent stores
vi.mock('../labStore', () => ({ default: { getState: vi.fn(() => ({ reset: vi.fn() })) } }));
vi.mock('../historyStore', () => ({ default: { getState: vi.fn(() => ({ reset: vi.fn() })) } }));
vi.mock('../profileStore', () => ({ default: { getState: vi.fn(() => ({ reset: vi.fn() })) } }));
vi.mock('../classroomStore', () => ({ default: { getState: vi.fn(() => ({ reset: vi.fn() })) } }));

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

  it('should initialize successfully with an active session', async () => {
    const mockUser = { id: 'user-123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should initialize correctly with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logout correctly', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { token: 'abc' },
      loading: false,
    });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });
});
