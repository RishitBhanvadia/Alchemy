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

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should initialize and fetch profile when session exists', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

    await useAuthStore.getState().init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('profiles');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear state on logout', async () => {
    useAuthStore.setState({
      user: { id: 'user-123' },
      profile: { role: 'student' },
      session: { token: 'abc' },
      loading: false
    });

    supabase.auth.signOut.mockResolvedValue();

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should create new profile if not found (PGRST116)', async () => {
    const mockUser = {
      id: 'user-456',
      email: 'new@example.com',
      user_metadata: { full_name: 'New User', role: 'teacher' }
    };
    const mockSession = { user: mockUser };
    const newProfile = { id: 'user-456', role: 'teacher', full_name: 'New User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // First query returns not found error
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' }
    });

    // Insert query returns the new profile
    const mockInsertSelect = vi.fn().mockReturnThis();
    const mockInsertSingle = vi.fn().mockResolvedValue({
      data: newProfile,
      error: null
    });
    const mockInsert = vi.fn().mockReturnValue({
      select: mockInsertSelect,
      single: mockInsertSingle
    });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
          insert: mockInsert
        };
      }
    });

    await useAuthStore.getState().init();

    expect(mockInsert).toHaveBeenCalledWith({
      id: mockUser.id,
      full_name: 'New User',
      display_name: 'New User',
      role: 'teacher',
      avatar_url: null,
    });

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(newProfile);
  });

  it('should handle onAuthStateChange correctly for SIGNED_OUT event', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    let stateChangeCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      stateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();

    expect(stateChangeCallback).toBeDefined();

    const mockLogout = vi.spyOn(useAuthStore.getState(), 'logout');

    delete window.location;
    window.location = { href: '' };

    await stateChangeCallback('SIGNED_OUT', null);

    expect(mockLogout).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('should set error on init exception', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Auth failed'));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Auth failed');
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: 'user-789', user_metadata: { full_name: 'Test Refresh' } };
    useAuthStore.setState({ user: mockUser, profile: null });

    const mockProfile = { id: 'user-789', full_name: 'Test Refresh', role: 'student' };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should handle onAuthStateChange correctly for SIGNED_IN event', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    let stateChangeCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      stateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    await useAuthStore.getState().init();
    expect(stateChangeCallback).toBeDefined();

    const mockUser = { id: 'user-abc', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-abc', role: 'student' };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

    await stateChangeCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });
});
