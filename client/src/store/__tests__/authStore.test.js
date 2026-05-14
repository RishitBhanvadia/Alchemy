import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn()
  }
}));

// mock dynamic imports for store resets
vi.mock('../labStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../historyStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../profileStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../classroomStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));

describe('authStore', () => {
  let authStateChangeCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null
    });

    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
  });

  it('should clear state, call signOut, and attempt to reset sibling stores on logout', async () => {
    useAuthStore.setState({ user: { id: '123' }, profile: { name: 'Test' }, session: { access_token: 'abc' } });
    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should initialize with no session and set loading to false', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should initialize with existing session and fetch profile', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };
    const mockProfile = { id: 'user123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
  });

  it('should handle missing profile gracefully during initialization', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Simulate error during select
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
  });

  it('should create new profile if PGRST116 (not found) is returned', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', user_metadata: { role: 'teacher' } };
    const mockSession = { user: mockUser, access_token: 'token123' };
    const mockInsertedProfile = { id: 'user123', full_name: 'Unknown User', role: 'teacher' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // first select returns PGRST116 error, then insert succeeds
    const selectSingleMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Row not found' } });
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: selectSingleMock
      })
    });

    const insertSelectSingleMock = vi.fn().mockResolvedValue({ data: mockInsertedProfile, error: null });
    const insertSelectMock = vi.fn().mockReturnValue({ single: insertSelectSingleMock });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelectMock });

    supabase.from.mockImplementation(() => {
      return {
        select: selectMock,
        insert: insertMock
      };
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockInsertedProfile);
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    useAuthStore.setState({ user: mockUser, profile: { full_name: 'Old Name' } });

    const mockProfile = { id: 'user123', full_name: 'New Name', role: 'student' };
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should not refresh profile if user is not logged in', async () => {
    useAuthStore.setState({ user: null });
    await useAuthStore.getState().refreshProfile();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should set error on session initialization error', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Network error'));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });

  it('should handle SIGNED_OUT auth state change', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    useAuthStore.setState({ user: { id: '123' }, profile: { name: 'Test' }, session: { access_token: 'abc' } });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    await authStateChangeCallback('SIGNED_OUT', null);

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/login');

    window.location = originalLocation;
  });

  it('should handle SIGNED_IN auth state change', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };
    const mockProfile = { id: 'user123', full_name: 'Test User' };

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await authStateChangeCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle TOKEN_REFRESHED auth state change', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token_refreshed_123' };
    const mockProfile = { id: 'user123', full_name: 'Test User' };

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await authStateChangeCallback('TOKEN_REFRESHED', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should log error when profile fetch fails without PGRST116 code', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate error during select
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error', code: 'DB_ERROR' } })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    expect(consoleErrorSpy).toHaveBeenCalledWith('[authStore] Profile fetch error:', 'Database error', 'DB_ERROR');

    consoleErrorSpy.mockRestore();
  });

  it('should log error when profile creation fails', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', user_metadata: { role: 'teacher' } };
    const mockSession = { user: mockUser, access_token: 'token123' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // first select returns PGRST116 error, then insert fails
    const selectSingleMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Row not found' } });
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: selectSingleMock
      })
    });

    const insertSelectSingleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed', code: 'INSERT_ERROR' } });
    const insertSelectMock = vi.fn().mockReturnValue({ single: insertSelectSingleMock });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelectMock });

    supabase.from.mockImplementation(() => {
      return {
        select: selectMock,
        insert: insertMock
      };
    });

    await useAuthStore.getState().init();

    expect(consoleErrorSpy).toHaveBeenCalledWith('[authStore] Failed to create profile:', 'Insert failed', 'INSERT_ERROR');

    consoleErrorSpy.mockRestore();
  });

  it('should log error when fetchProfile throws exception', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate error during select
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockRejectedValue(new Error('Unknown exception'))
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    expect(consoleErrorSpy).toHaveBeenCalledWith('[authStore] fetchProfile exception:', 'Unknown exception');

    consoleErrorSpy.mockRestore();
  });
});
