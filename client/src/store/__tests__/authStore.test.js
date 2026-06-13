import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Mock window.location for testing logout redirect in onAuthStateChange
const originalLocation = window.location;

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

    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('should initialize with correct default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle successful login flow via init', async () => {
    const mockSession = { user: { id: '123', email: 'test@example.com' } };
    const mockProfile = { id: '123', role: 'student', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    supabase.from.mockReturnValueOnce({ select: mockSelect, eq: mockEq, single: mockSingle });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockSession.user);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle init when no session is present', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle init when fetch profile fails', async () => {
    const mockSession = { user: { id: '123', email: 'test@example.com' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
    supabase.from.mockReturnValueOnce({ select: mockSelect, eq: mockEq, single: mockSingle });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockSession.user);
    expect(state.profile).toBeNull();
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Profile not found');
  });

  it('should handle logout correctly', async () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { user: { id: '123' } },
      loading: false,
      error: null,
    });

    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should setup onAuthStateChange and handle SIGNED_OUT event', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    // Capture the callback passed to onAuthStateChange
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
    });

    await useAuthStore.getState().init();
    expect(authCallback).toBeDefined();

    // Trigger SIGNED_OUT
    await authCallback('SIGNED_OUT', null);

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('should setup onAuthStateChange and handle SIGNED_IN event', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    // Capture the callback passed to onAuthStateChange
    let authCallback = null;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
    });

    await useAuthStore.getState().init();

    const mockSession = { user: { id: '123', email: 'test@example.com' } };
    const mockProfile = { id: '123', role: 'student', full_name: 'Test User' };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    supabase.from.mockReturnValueOnce({ select: mockSelect, eq: mockEq, single: mockSingle });

    // Trigger SIGNED_IN
    await authCallback('SIGNED_IN', mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockSession.user);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle profile creation fallback (PGRST116)', async () => {
    const mockSession = { user: { id: '123', email: 'fallback@example.com', user_metadata: { full_name: 'Fallback User' } } };
    const newProfile = { id: '123', full_name: 'Fallback User', role: 'student' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    const mockInsert = vi.fn().mockReturnThis();
    const mockInsertSelect = vi.fn().mockReturnThis();
    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: newProfile, error: null });

    supabase.from.mockImplementation(() => {
        return {
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
          insert: mockInsert.mockReturnValue({
            select: mockInsertSelect.mockReturnValue({
              single: mockInsertSingle
            })
          })
        };
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(newProfile);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      id: '123',
      full_name: 'Fallback User'
    }));
  });

  it('should handle profile creation fallback failure', async () => {
    const mockSession = { user: { id: '123', email: 'fallback@example.com' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    const mockInsert = vi.fn().mockReturnThis();
    const mockInsertSelect = vi.fn().mockReturnThis();
    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: '500' } });

    supabase.from.mockImplementation(() => {
        return {
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
          insert: mockInsert.mockReturnValue({
            select: mockInsertSelect.mockReturnValue({
              single: mockInsertSingle
            })
          })
        };
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });

  it('should handle fetchProfile exception', async () => {
    const mockSession = { user: { id: '123' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    // Force an exception by mocking supabase.from to throw
    supabase.from.mockImplementationOnce(() => {
      throw new Error('Database down');
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });

  it('should handle init failure', async () => {
     supabase.auth.getSession.mockRejectedValueOnce(new Error('Network error'));

     await useAuthStore.getState().init();

     const state = useAuthStore.getState();
     expect(state.loading).toBe(false);
     expect(state.error).toBe('Network error');
  });

  it('should refreshProfile successfully', async () => {
    useAuthStore.setState({ user: { id: '123' } });

    const mockProfile = { id: '123', full_name: 'Updated Name' };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    supabase.from.mockReturnValueOnce({ select: mockSelect, eq: mockEq, single: mockSingle });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should do nothing on refreshProfile if no user id', async () => {
    useAuthStore.setState({ user: null });

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });
});
