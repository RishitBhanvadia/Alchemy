import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));

const mockInsertSelectSingle = vi.fn();
const mockInsertSelect = vi.fn(() => ({ single: mockInsertSelectSingle }));
const mockInsert = vi.fn(() => ({ select: mockInsertSelect }));

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: mockSelect,
        insert: mockInsert
      })),
    }
  };
});

describe('authStore', () => {
  let mockOnAuthStateChange;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });

    mockOnAuthStateChange = supabase.auth.onAuthStateChange;
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should clear state on logout', async () => {
    useAuthStore.setState({
      user: { id: '123' },
      profile: { name: 'Test User' },
      session: { access_token: 'abc' }
    });

    supabase.auth.signOut.mockResolvedValue({});

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle valid session and fetch profile on init', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user123', role: 'student', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error if profile not found on init', async () => {
    const mockUser = { id: 'user123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    // Simulate generic error that prevents profile creation/fetch
    mockSingle.mockResolvedValue({ data: null, error: { message: 'Network error', code: '500' } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toBeNull();
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Profile not found');
  });

  it('should create new profile if PGRST116 (not found) is returned', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', user_metadata: { full_name: 'New User' } };
    const mockSession = { user: mockUser };
    const newProfile = { id: 'user123', full_name: 'New User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // First query returns not found
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    // Insert succeeds
    mockInsertSelectSingle.mockResolvedValue({ data: newProfile, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(newProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fallback to email for profile name if user_metadata has no full_name', async () => {
    const mockUser = { id: 'user123', email: 'johndoe@example.com', user_metadata: {} };
    const mockSession = { user: mockUser };
    const newProfile = { id: 'user123', full_name: 'johndoe', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    mockInsertSelectSingle.mockResolvedValue({ data: newProfile, error: null });

    await useAuthStore.getState().init();

    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.full_name).toBe('johndoe');
    expect(insertCall.display_name).toBe('johndoe');
  });

  it('should fallback to "Unknown User" if neither email nor user_metadata exists', async () => {
    const mockUser = { id: 'user123', user_metadata: {} }; // no email
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    mockInsertSelectSingle.mockResolvedValue({ data: { id: 'user123' }, error: null });

    await useAuthStore.getState().init();

    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.full_name).toBe('Unknown User');
  });

  it('should handle profile creation error', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // First query returns not found
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    // Insert fails
    mockInsertSelectSingle.mockResolvedValue({ data: null, error: { message: 'Insert failed', code: '500' } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
  });

  it('should handle auth state change: SIGNED_OUT', async () => {
    // Setup initial state and mocks
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    // Store original window.location
    const originalLocation = window.location;
    // Mock window.location
    delete window.location;
    window.location = { href: '' };

    await useAuthStore.getState().init();

    // Get the callback passed to onAuthStateChange
    const authCallback = mockOnAuthStateChange.mock.calls[0][0];

    // Simulate SIGNED_OUT
    supabase.auth.signOut.mockResolvedValue({});
    useAuthStore.setState({ user: { id: '123' }, profile: { name: 'Test User' } });

    await authCallback('SIGNED_OUT', null);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(window.location.href).toBe('/login');

    // Restore window.location
    window.location = originalLocation;
  });

  it('should handle auth state change: SIGNED_IN', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const authCallback = mockOnAuthStateChange.mock.calls[0][0];

    const mockUser = { id: 'user123' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user123', role: 'teacher' };

    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    await authCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle auth state change: OTHER_EVENT', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const authCallback = mockOnAuthStateChange.mock.calls[0][0];
    const initialProfile = { id: 'user123' };

    useAuthStore.setState({ profile: initialProfile });

    await authCallback('PASSWORD_RECOVERY', null);

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(initialProfile);
  });

  it('should handle auth state change with no user', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await useAuthStore.getState().init();

    const authCallback = mockOnAuthStateChange.mock.calls[0][0];
    const initialProfile = { id: 'user123' };

    useAuthStore.setState({ user: null, profile: initialProfile });

    // If TOKEN_REFRESHED happens with a null session/user for some reason
    await authCallback('TOKEN_REFRESHED', null);

    const state = useAuthStore.getState();
    // Profile shouldn't change since we didn't fetch a new one
    expect(state.profile).toEqual(initialProfile);
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: 'user123' };
    useAuthStore.setState({ user: mockUser, profile: { role: 'student' } });

    const refreshedProfile = { id: 'user123', role: 'teacher' };
    mockSingle.mockResolvedValue({ data: refreshedProfile, error: null });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(refreshedProfile);
  });

  it('should not update state if refresh profile returns null', async () => {
    const mockUser = { id: 'user123' };
    const initialProfile = { role: 'student' };
    useAuthStore.setState({ user: mockUser, profile: initialProfile });

    mockSingle.mockResolvedValue({ data: null, error: { message: 'Network' } });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(initialProfile);
  });

  it('should not refresh profile if no user ID', async () => {
    useAuthStore.setState({ user: null, profile: null });

    await useAuthStore.getState().refreshProfile();

    expect(mockSingle).not.toHaveBeenCalled();
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('should handle fetchProfile throwing an exception', async () => {
    const mockUser = { id: 'user123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSingle.mockRejectedValue(new Error('Network offline'));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
  });

  it('should handle init throwing an exception', async () => {
    const errorMsg = 'Failed to get session';
    supabase.auth.getSession.mockRejectedValue(new Error(errorMsg));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
  it('should not log error if no error returned and no data in fetchProfile', async () => {
    const mockUser = { id: 'user123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSingle.mockResolvedValue({ data: null, error: null });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await useAuthStore.getState().init();

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Profile fetch error:'));
    consoleSpy.mockRestore();
  });

});