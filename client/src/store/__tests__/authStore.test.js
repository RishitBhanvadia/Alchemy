import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabaseClient';
import useAuthStore from '../authStore';

// Mock Supabase
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

describe('AuthStore', () => {
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

  it('should initialize successfully with session and fetch profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock the profile fetch chain
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
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

  it('should handle initialization with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear state on logout', async () => {
    supabase.auth.signOut.mockResolvedValue({});

    useAuthStore.setState({
      user: { id: '123' },
      profile: { name: 'Test' },
      session: { token: 'abc' },
      loading: false,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle fetchProfile errors correctly', async () => {
    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock the profile fetch chain with an error
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    // Mock console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[authStore] Profile fetch error:',
      'Database error',
      undefined
    );

    consoleSpy.mockRestore();
  });

  it('should handle PGRST116 (Not Found) by creating a profile', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test Name', role: 'student' }
    };
    const mockSession = { user: mockUser };
    const mockNewProfile = { id: '123', full_name: 'Test Name', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // First call to select fails with PGRST116
    const mockSelectSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSelectSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    // Second call to insert succeeds
    const mockInsertSingle = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: mockSelect, insert: mockInsert };
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockNewProfile);
    expect(mockInsert).toHaveBeenCalledWith({
      id: '123',
      full_name: 'Test Name',
      display_name: 'Test Name',
      role: 'student',
      avatar_url: null,
    });
  });

  it('should refresh profile successfully', async () => {
    useAuthStore.setState({
      user: { id: '123', user_metadata: { full_name: 'Test Name' } }
    });

    const mockProfile = { id: '123', full_name: 'Updated Name' };

    // Mock the profile fetch chain
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should handle onAuthStateChange correctly', async () => {
    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', full_name: 'Test' };

    // Mock getSession to return null initially
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    // Mock profile fetch for the onAuthStateChange handler
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    // Store the callback
    let authCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
    });

    await useAuthStore.getState().init();

    // Trigger sign in
    await authCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });
});
