import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(),
    }
  };
});

// Mock dynamic imports
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../historyStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../profileStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../classroomStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));

describe('authStore', () => {
  const originalLocation = window.location;

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

  it('should initialize with null user when no session exists', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should set user and fetch profile on init with active session', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockProfile = { id: '123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // Mock profile fetch
    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle session error correctly', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Session fetch failed'));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Session fetch failed');
  });

  it('should clear user state on logout', async () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { name: 'Test' },
      session: { access_token: 'token' },
      loading: false
    });

    supabase.auth.signOut.mockResolvedValue({});

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should handle logout errors silently for dynamic store imports', async () => {
    // Mock the dynamic imports to throw
    vi.doMock('../labStore', () => { throw new Error('Dynamic import failed'); });
    vi.doMock('../historyStore', () => { throw new Error('Dynamic import failed'); });
    vi.doMock('../profileStore', () => { throw new Error('Dynamic import failed'); });
    vi.doMock('../classroomStore', () => { throw new Error('Dynamic import failed'); });

    useAuthStore.setState({
      user: { id: '123' },
      profile: { name: 'Test' },
      session: { access_token: 'token' },
      loading: false
    });

    supabase.auth.signOut.mockResolvedValue({});

    // This should not throw
    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();

    // reset mocks
    vi.doUnmock('../labStore');
    vi.doUnmock('../historyStore');
    vi.doUnmock('../profileStore');
    vi.doUnmock('../classroomStore');
  });

  it('should create new profile if PGRST116 error is returned during fetchProfile', async () => {
    const mockUser = { id: '123', email: 'test@example.com', user_metadata: { role: 'teacher', full_name: 'Test Teacher', avatar_url: 'http://example.com/avatar.png' } };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockNewProfile = { id: '123', role: 'teacher', full_name: 'Test Teacher', display_name: 'Test Teacher', avatar_url: 'http://example.com/avatar.png' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // 1. the initial fetch returns PGRST116
    const singleFetchMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const eqFetchMock = vi.fn().mockReturnValue({ single: singleFetchMock });
    const selectFetchMock = vi.fn().mockReturnValue({ eq: eqFetchMock });

    // 2. the subsequent insert returns the created profile
    const singleInsertMock = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
    const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
         return {
            select: selectFetchMock,
            insert: insertMock
         }
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        id: '123',
        full_name: 'Test Teacher',
        display_name: 'Test Teacher',
        role: 'teacher',
        avatar_url: 'http://example.com/avatar.png'
    }));
    expect(state.profile).toEqual(mockNewProfile);
  });

  it('should update state when onAuthStateChange fires SIGNED_OUT', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    // Mock window.location
    Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
    });

    useAuthStore.setState({ user: { id: '123' }, profile: { name: 'Test' } });

    supabase.auth.signOut.mockResolvedValue({});

    // Fire the callback
    if(authCallback) {
        await authCallback('SIGNED_OUT', null);
    }

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(window.location.href).toBe('/login');

    // Restore window.location
    Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
    });
  });

  it('should return early when refreshProfile is called with no user ID', async () => {
    useAuthStore.setState({ user: null });
    await useAuthStore.getState().refreshProfile();
    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: '123', user_metadata: { role: 'teacher', full_name: 'Test Teacher' } };
    useAuthStore.setState({ user: mockUser });

    const mockRefreshedProfile = { id: '123', role: 'teacher', full_name: 'Updated Name', display_name: 'Updated Name' };

    const singleMock = vi.fn().mockResolvedValue({ data: mockRefreshedProfile, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockRefreshedProfile);
  });

  it('should not update profile if refreshProfile fetch returns null', async () => {
    const mockUser = { id: '123', user_metadata: { role: 'teacher', full_name: 'Test Teacher' } };
    useAuthStore.setState({ user: mockUser, profile: { id: '123', role: 'teacher', full_name: 'Old Name' } });

    const singleMock = vi.fn().mockResolvedValue({ data: null, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual({ id: '123', role: 'teacher', full_name: 'Old Name' });
  });

  it('should handle fetch profile error gracefully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // Mock profile fetch
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "Test Error", code: "UNKNOWN" } });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    // spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    // Profile is null because of fetch error
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
    expect(consoleSpy).toHaveBeenCalledWith('[authStore] Profile fetch error:', "Test Error", "UNKNOWN");

    consoleSpy.mockRestore();
  });

  it('should handle fetch profile insert error gracefully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // 1. the initial fetch returns PGRST116
    const singleFetchMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const eqFetchMock = vi.fn().mockReturnValue({ single: singleFetchMock });
    const selectFetchMock = vi.fn().mockReturnValue({ eq: eqFetchMock });

    // 2. the subsequent insert returns an error
    const singleInsertMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed', code: 'INSERT_ERR' } });
    const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
         return {
            select: selectFetchMock,
            insert: insertMock
         }
      }
    });

    // spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    // Profile is null because of fetch error
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
    expect(consoleSpy).toHaveBeenCalledWith('[authStore] Failed to create profile:', "Insert failed", "INSERT_ERR");

    consoleSpy.mockRestore();
  });

  it('should handle general profile fetch exception gracefully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    supabase.from.mockImplementation(() => {
        throw new Error("Network error");
    });

    // spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    // Profile is null because of fetch error
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
    expect(consoleSpy).toHaveBeenCalledWith('[authStore] fetchProfile exception:', "Network error");

    consoleSpy.mockRestore();
  });

  it('should update state when onAuthStateChange fires SIGNED_IN', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockProfile = { id: '123', role: 'student' };

    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    // Fire the callback
    if(authCallback) {
        await authCallback('SIGNED_IN', mockSession);
    }

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should update state when onAuthStateChange fires TOKEN_REFRESHED', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockProfile = { id: '123', role: 'student' };

    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    // Fire the callback
    if(authCallback) {
        await authCallback('TOKEN_REFRESHED', mockSession);
    }

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should ignore onAuthStateChange TOKEN_REFRESHED with no user in session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();
    useAuthStore.setState({ user: null, profile: null, session: null });

    // Fire the callback with a session that has no user
    if(authCallback) {
        await authCallback('TOKEN_REFRESHED', { access_token: 'test' });
    }

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should fallback to split email if user_metadata full_name is missing when creating profile', async () => {
    const mockUser = { id: '123', email: 'fallbackuser@example.com', user_metadata: {} };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockNewProfile = { id: '123', role: 'student', full_name: 'fallbackuser', display_name: 'fallbackuser' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // 1. the initial fetch returns PGRST116
    const singleFetchMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const eqFetchMock = vi.fn().mockReturnValue({ single: singleFetchMock });
    const selectFetchMock = vi.fn().mockReturnValue({ eq: eqFetchMock });

    // 2. the subsequent insert returns the created profile
    const singleInsertMock = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
    const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
         return {
            select: selectFetchMock,
            insert: insertMock
         }
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        id: '123',
        full_name: 'fallbackuser',
        display_name: 'fallbackuser',
        role: 'student'
    }));
    expect(state.profile).toEqual(mockNewProfile);
  });

  it('should fallback to Unknown User if user_metadata full_name and email are missing when creating profile', async () => {
    const mockUser = { id: '123', user_metadata: {} }; // no email
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockNewProfile = { id: '123', role: 'student', full_name: 'Unknown User', display_name: 'Unknown User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({});

    // 1. the initial fetch returns PGRST116
    const singleFetchMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const eqFetchMock = vi.fn().mockReturnValue({ single: singleFetchMock });
    const selectFetchMock = vi.fn().mockReturnValue({ eq: eqFetchMock });

    // 2. the subsequent insert returns the created profile
    const singleInsertMock = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
    const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
         return {
            select: selectFetchMock,
            insert: insertMock
         }
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        id: '123',
        full_name: 'Unknown User',
        display_name: 'Unknown User',
        role: 'student'
    }));
    expect(state.profile).toEqual(mockNewProfile);
  });

  it('should ignore onAuthStateChange events other than SIGNED_OUT, SIGNED_IN, or TOKEN_REFRESHED', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };

    // Set initial state
    useAuthStore.setState({ user: null, profile: null, session: null });

    // Fire the callback with unhandled event
    if(authCallback) {
        await authCallback('PASSWORD_RECOVERY', mockSession);
    }

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });
});
