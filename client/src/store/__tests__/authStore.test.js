import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  const supabaseClient = {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn()
  };
  return { supabase: supabaseClient };
});

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('init() should set state when session and user exist and profile fetch is successful', async () => {
    const mockUser = { id: 'test-user-id', user_metadata: { full_name: 'Test User' } };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'test-user-id', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    // Mock fetchProfile's Supabase chain
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });

    supabase.from.mockReturnValueOnce({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('logout() should sign out and clear auth state', async () => {
     // Set some initial state
     useAuthStore.setState({
       user: { id: '1' },
       profile: { role: 'student' },
       session: { token: '123' },
       loading: false
     });

     supabase.auth.signOut.mockResolvedValueOnce({});

     await useAuthStore.getState().logout();

     const state = useAuthStore.getState();
     expect(supabase.auth.signOut).toHaveBeenCalled();
     expect(state.user).toBeNull();
     expect(state.profile).toBeNull();
     expect(state.session).toBeNull();
     expect(state.loading).toBe(false);
  });
});
