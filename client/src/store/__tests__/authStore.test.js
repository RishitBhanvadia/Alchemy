import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockInsert = vi.fn(() => ({ select: mockSelect, single: mockSingle }));
  const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert }));

  return {
    supabase: {
      from: mockFrom,
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
    },
  };
});

// Mock deferred stores
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

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should initialize successfully with session', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-1', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock fetchProfile to return a profile
    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should logout correctly', async () => {
    useAuthStore.setState({
      user: { id: '1' },
      profile: { role: 'teacher' },
      session: { token: 'xyz' },
      loading: false,
      error: null,
    });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle onAuthStateChange correctly for SIGNED_OUT', async () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: 'user-1' },
      profile: { role: 'teacher' },
      session: { user: { id: 'user-1' } },
      loading: false,
    });

    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    // Get the callback passed to onAuthStateChange
    const onAuthStateChangeCall = supabase.auth.onAuthStateChange.mock.calls[0][0];

    // Trigger SIGNED_OUT
    await onAuthStateChangeCall('SIGNED_OUT', null);

    // Verify state was reset and user was redirected
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('should handle onAuthStateChange correctly for SIGNED_IN', async () => {
    const mockUser = { id: 'user-2', email: 'test2@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user-2', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    // Reset mocks before trigger
    vi.clearAllMocks();

    // Create a new mock for the next call
    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockProfile, error: null });

    // Get the callback passed to onAuthStateChange during init
    // Need to re-init after clearAllMocks
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const onAuthStateChangeCall = supabase.auth.onAuthStateChange.mock.calls[0][0];

    // Trigger SIGNED_IN
    await onAuthStateChangeCall('SIGNED_IN', mockSession);

    // Verify state was updated
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle fetchProfile errors during init', async () => {
    const mockUser = { id: 'user-3' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock fetchProfile to return an error (PGRST116 means not found, but we mock general error to see it fails gracefully or creates user)
    supabase.from().select().eq().single.mockResolvedValueOnce({ data: null, error: { message: 'Network error' } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
  });

  it('should handle refreshProfile successfully', async () => {
    const mockUser = { id: 'user-1', user_metadata: { full_name: 'Test User' } };
    const mockProfile = { id: 'user-1', full_name: 'Test User', role: 'student' };

    useAuthStore.setState({
      user: mockUser,
      profile: null,
    });

    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should handle refreshProfile without user gracefully', async () => {
    useAuthStore.setState({
      user: null,
      profile: null,
    });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });
});
