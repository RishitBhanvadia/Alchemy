import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    },
  };
});

describe('useAuthStore', () => {
  const mockUser = { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } };
  const mockProfile = { id: '123', role: 'student', full_name: 'Test User' };

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

  const setupSupabaseMock = (profileData = mockProfile, error = null) => {
    const singleMock = vi.fn().mockResolvedValue({ data: profileData, error });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    const insertSingleMock = vi.fn().mockResolvedValue({ data: profileData, error: null });
    const insertSelectMock = vi.fn().mockReturnValue({ single: insertSingleMock });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelectMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: selectMock,
          insert: insertMock,
        };
      }
      return {};
    });
  };

  it('should initialize with session and fetch profile', async () => {
    const mockSession = { user: mockUser, access_token: 'token' };
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    setupSupabaseMock(mockProfile);

    // mock onAuthStateChange to return a dummy unsubscribe
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear state on initialization if no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should clear state on logout', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    // pre-fill state
    useAuthStore.setState({ user: mockUser, profile: mockProfile, session: { user: mockUser } });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle session without profile (profile creation fallback)', async () => {
    const mockSession = { user: mockUser, access_token: 'token' };
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // Mock select single to fail with PGRST116 (Not Found) to trigger insert
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    const newProfile = { id: '123', full_name: 'Test User', role: 'student' };
    const insertSingleMock = vi.fn().mockResolvedValue({ data: newProfile, error: null });
    const insertSelectMock = vi.fn().mockReturnValue({ single: insertSingleMock });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelectMock });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: selectMock,
          insert: insertMock,
        };
      }
      return {};
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(newProfile);
    expect(insertMock).toHaveBeenCalled();
  });

  it('should refresh profile if user exists', async () => {
    useAuthStore.setState({ user: mockUser });
    const updatedProfile = { ...mockProfile, role: 'teacher' };
    setupSupabaseMock(updatedProfile);

    await useAuthStore.getState().refreshProfile();

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(updatedProfile);
  });
});
