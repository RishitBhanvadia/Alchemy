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
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock the dynamically imported stores to prevent errors
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../historyStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../profileStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../classroomStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));

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

  it('should initialize successfully when session is present and profile exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student', display_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    // Mock profile fetch success
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null }),
        }),
      }),
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should set error if initialization fails due to Supabase error', async () => {
    const errorMsg = 'Network Error';
    supabase.auth.getSession.mockRejectedValueOnce(new Error(errorMsg));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  it('should clear state on logout', async () => {
    // Set initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123', role: 'student' },
      session: { token: 'abc' },
      loading: false,
      error: null,
    });

    supabase.auth.signOut.mockResolvedValueOnce();

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
