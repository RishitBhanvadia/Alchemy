import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('should initialize with correct default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle init successfully without profile fallback', async () => {
    const mockUser = { id: 'user-123' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq, single: mockSingle });

    supabase.from.mockReturnValue({ select: mockSelect });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle profile creation fallback during init if profile not found', async () => {
    const mockUser = { id: 'user-123', email: 'test@test.com', user_metadata: { full_name: 'Test User' } };
    const mockSession = { user: mockUser };
    const newProfile = { id: 'user-123', display_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockEq = vi.fn().mockReturnThis();
    const mockSingleNotFound = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq, single: mockSingleNotFound });

    const mockInsertSingle = vi.fn().mockResolvedValue({ data: newProfile, error: null });
    const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: mockSelect, insert: mockInsert };
      }
    });

    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(newProfile);
    expect(state.session).toEqual(mockSession);
    expect(mockInsert).toHaveBeenCalledWith({
      id: mockUser.id,
      full_name: 'Test User',
      display_name: 'Test User',
      role: 'student',
      avatar_url: null,
    });
  });

  it('should handle auth state change to SIGNED_OUT', async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    let authStateCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    useAuthStore.setState({ user: { id: '1' } });
    supabase.auth.signOut.mockResolvedValue();

    await authStateCallback('SIGNED_OUT', null);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(window.location.href).toBe('/login');

    window.location = originalLocation;
  });

  it('should handle init with null session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should handle init error', async () => {
    const mockError = new Error('Network error');
    supabase.auth.getSession.mockRejectedValue(mockError);

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle logout', async () => {
    supabase.auth.signOut.mockResolvedValue();
    useAuthStore.setState({ user: { id: '1' }, profile: { name: 'Test' }, session: {} });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });
});
