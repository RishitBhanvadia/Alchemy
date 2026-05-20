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
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should initialize with a session and fetch profile', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should handle logout correctly', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    useAuthStore.setState({ user: { id: '123' }, session: {}, profile: {} });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('should create a profile if PGRST116 (not found) is returned', async () => {
    const mockUser = { id: '123', email: 'test@test.com', user_metadata: { full_name: 'Test Create', role: 'student' } };
    const mockSession = { user: mockUser };
    const mockNewProfile = { id: '123', full_name: 'Test Create', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Create the insert chain
    const mockInsertSingle = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    // Create the select chain (returns error PGRST116)
    const mockSelectSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSelectSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    supabase.from.mockReturnValue({
      select: mockSelect,
      insert: mockInsert
    });

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockNewProfile);
    expect(mockInsert).toHaveBeenCalled();
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: '123', user_metadata: { full_name: 'Refresh User' } };
    const mockProfile = { id: '123', full_name: 'Refresh User', role: 'student' };

    useAuthStore.setState({ user: mockUser });

    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('should handle fetchProfile errors', async () => {
    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER_ERR', message: 'Failed' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    // Mock console.error to avoid noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(consoleSpy).toHaveBeenCalledWith('[authStore] Profile fetch error:', 'Failed', 'OTHER_ERR');
    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle insert profile error', async () => {
    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Create the insert chain with error
    const mockInsertSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'INSERT_ERR', message: 'Insert failed' } });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    // Create the select chain (returns error PGRST116)
    const mockSelectSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSelectSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    supabase.from.mockReturnValue({
      select: mockSelect,
      insert: mockInsert
    });

    // Mock console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(consoleSpy).toHaveBeenCalledWith('[authStore] Failed to create profile:', 'Insert failed', 'INSERT_ERR');
    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle onAuthStateChange SIGNED_IN event', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    let callback;
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      callback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', full_name: 'Test Signed In' };

    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await callback('SIGNED_IN', mockSession);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('should handle fetchProfile throwing an exception', async () => {
    const mockUser = { id: '123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Make supabase.from throw an error directly
    supabase.from.mockImplementation(() => {
      throw new Error('Unexpected exception');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(consoleSpy).toHaveBeenCalledWith('[authStore] fetchProfile exception:', 'Unexpected exception');
    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle onAuthStateChange SIGNED_OUT event', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    let callback;
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      callback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    // Mock window.location
    delete window.location;
    window.location = { href: '' };

    // Set initial state so logout has something to clear
    useAuthStore.setState({ user: { id: '123' }, session: {}, profile: {} });

    await callback('SIGNED_OUT');

    expect(useAuthStore.getState().user).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('should handle init errors gracefully', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Init exception'));

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().error).toBe('Init exception');
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
