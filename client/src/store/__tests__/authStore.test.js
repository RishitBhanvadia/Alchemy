import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn()
  }
}));

// Mock window.location.href
const originalLocation = window.location;

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null
    });

    // Mock location
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('should initialize with no user if session is empty', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should fetch user and profile when session exists on init', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession }
    });

    // Deep mock for supabase.from('profiles').select().eq().single()
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ select: mockSelect });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should logout user and reset state', async () => {
    // Set some initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { user: { id: '123' } },
      loading: false
    });

    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle profile creation fallback (PGRST116)', async () => {
    const mockUser = { id: '123', email: 'test@test.com', user_metadata: { full_name: 'Test User' } };
    const mockSession = { user: mockUser };
    const mockNewProfile = { id: '123', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession }
    });

    // Mock initial fetch failure (PGRST116)
    const mockSingleFetch = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingleFetch });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    // Mock subsequent insert
    const mockSingleInsert = vi.fn().mockResolvedValueOnce({ data: mockNewProfile, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingleInsert });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: mockSelect, insert: mockInsert };
      }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockNewProfile);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      id: '123',
      full_name: 'Test User'
    }));
  });
});
