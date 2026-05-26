import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabaseClient';
import useAuthStore from '../authStore';

// Mock other stores to avoid circular dependencies in logout
vi.mock('./labStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('./historyStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('./profileStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('./classroomStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));

const mockSingle = vi.fn();
const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn() }) });

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
    })),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });

    // Default mock implementation
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    // Save auth state change callback to test it
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    // Store it on the mock function so we can retrieve it in tests
    supabase.auth.onAuthStateChange.mock.callback = () => authCallback;
  });

  it('initializes with no user if session is null', async () => {
    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('initializes with user and fetches profile if session exists', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockProfile = { id: 'user-123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  it('handles init error gracefully', async () => {
    const error = new Error('Init failed');
    supabase.auth.getSession.mockRejectedValueOnce(error);

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBe('Init failed');
  });

  it('handles fetchProfile generic error', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'DB Error', code: '500' } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().error).toBe('Profile not found');
  });

  it('handles fetchProfile exception', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    mockSingle.mockRejectedValueOnce(new Error('Network error'));

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().error).toBe('Profile not found');
  });

  it('handles SIGNED_OUT event correctly', async () => {
    // Setup window.location mock
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    await useAuthStore.getState().init();

    const callback = supabase.auth.onAuthStateChange.mock.callback();
    expect(callback).toBeDefined();

    useAuthStore.setState({ user: { id: '123' }, profile: { role: 'student' } });

    await callback('SIGNED_OUT', null);

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(window.location.href).toBe('/login');

    // Restore window.location
    window.location = originalLocation;
  });

  it('handles SIGNED_IN event correctly', async () => {
    await useAuthStore.getState().init();

    const callback = supabase.auth.onAuthStateChange.mock.callback();

    const mockUser = { id: 'user-123' };
    const mockProfile = { id: 'user-123', role: 'student' };
    const mockSession = { user: mockUser };

    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    await callback('SIGNED_IN', mockSession);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('handles TOKEN_REFRESHED event correctly', async () => {
    await useAuthStore.getState().init();

    const callback = supabase.auth.onAuthStateChange.mock.callback();

    const mockUser = { id: 'user-123' };
    const mockProfile = { id: 'user-123', role: 'student' };
    const mockSession = { user: mockUser };

    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    await callback('TOKEN_REFRESHED', mockSession);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('creates profile on init if profile is not found (PGRST116)', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } };
    const mockNewProfile = { id: 'user-123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    // First call to fetch profile returns not found error
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    // Insert call returns new profile
    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: mockNewProfile, error: null });
    mockInsert.mockReturnValueOnce({ select: vi.fn().mockReturnValueOnce({ single: mockInsertSingle }) });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockNewProfile);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      id: 'user-123',
      full_name: 'Test User',
      role: 'student'
    }));
  });

  it('handles profile creation failure on init', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    // First call to fetch profile returns not found error
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    // Insert call returns error
    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: '500' } });
    mockInsert.mockReturnValueOnce({ select: vi.fn().mockReturnValueOnce({ single: mockInsertSingle }) });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('handles missing data in profile creation', async () => {
    const mockUser = { id: 'user-123' }; // No email or metadata
    const mockNewProfile = { id: 'user-123', full_name: 'Unknown User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: mockNewProfile, error: null });
    mockInsert.mockReturnValueOnce({ select: vi.fn().mockReturnValueOnce({ single: mockInsertSingle }) });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().profile).toEqual(mockNewProfile);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      full_name: 'Unknown User'
    }));
  });

  it('logout clears user state and calls signOut', async () => {
    useAuthStore.setState({ user: { id: '123' }, profile: { role: 'student' }, session: {} });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('refreshProfile updates profile state for logged in user', async () => {
    const mockUser = { id: 'user-123' };
    const mockProfile = { id: 'user-123', full_name: 'Updated Name', role: 'teacher' };

    useAuthStore.setState({ user: mockUser, profile: { id: 'user-123', full_name: 'Old Name' } });

    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
  });

  it('refreshProfile does nothing if no user is logged in', async () => {
    useAuthStore.setState({ user: null });

    await useAuthStore.getState().refreshProfile();

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
