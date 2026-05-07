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
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

// Mock dynamic imports for stores to avoid actual loading
vi.mock('../labStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with user and profile if session exists', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockProfile = { id: 'user-1', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null
      })
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should fetch and set profile on refreshProfile', async () => {
    const mockUser = { id: 'user-2' };
    const mockProfile = { id: 'user-2', role: 'teacher' };
    useAuthStore.setState({ user: mockUser });

    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null
      })
    });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should clear state on logout', async () => {
    // Set some initial state
    useAuthStore.setState({
      user: { id: '1' },
      profile: { role: 'teacher' },
      session: { token: 'abc' }
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });
});
