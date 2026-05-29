import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
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
      insert: vi.fn().mockReturnThis()
    }))
  }
}));

// Mock dynamic store imports to avoid circular dependencies during logout
vi.mock('../labStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));
vi.mock('../historyStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));
vi.mock('../profileStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));
vi.mock('../classroomStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with no user if session is empty', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should initialize with user and fetch profile if session exists', async () => {
    const mockUser = { id: 'user123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user123', role: 'student' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });

    // Mock the profile fetch chain
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should create a profile if one is not found during init', async () => {
    const mockUser = { id: 'user123', email: 'test@test.com', user_metadata: { full_name: 'Test User' } };
    const mockSession = { user: mockUser };
    const mockNewProfile = { id: 'user123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });

    // Mock profile fetch chain to return PGRST116 (not found)
    const mockSingleFetch = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    const mockEqFetch = vi.fn().mockReturnValue({ single: mockSingleFetch });
    const mockSelectFetch = vi.fn().mockReturnValue({ eq: mockEqFetch });

    // Mock profile insert chain
    const mockSingleInsert = vi.fn().mockResolvedValueOnce({ data: mockNewProfile, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingleInsert });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        // Need to determine if it's the select or insert call.
        // We can just return an object that has both chains ready.
        return {
          select: mockSelectFetch,
          insert: mockInsert
        };
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockNewProfile);
    expect(state.error).toBeNull();
  });

  it('should handle errors during init', async () => {
    const mockError = new Error('Auth error');
    supabase.auth.getSession.mockRejectedValueOnce(mockError);

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Auth error');
  });

  it('should clear state on logout', async () => {
    // Set initial state
    useAuthStore.setState({
      user: { id: 'user1' },
      profile: { role: 'teacher' },
      session: { token: 'abc' },
      loading: false,
    });

    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should refresh profile data', async () => {
    const mockUser = { id: 'user123' };
    const mockUpdatedProfile = { id: 'user123', role: 'teacher' };

    useAuthStore.setState({ user: mockUser });

    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockUpdatedProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockUpdatedProfile);
  });
});
