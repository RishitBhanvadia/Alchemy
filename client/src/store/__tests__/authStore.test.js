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

  it('should initialize correctly with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should fetch profile when session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'abc' };
    const mockProfile = { id: '123', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should create a default profile if profile is missing', async () => {
    const mockUser = { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Meta User' } };
    const mockSession = { user: mockUser };
    const mockCreatedProfile = { id: '123', full_name: 'Meta User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();

    // First call: Profile not found
    const mockSingleSelect = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    // Second call: Insert mock
    const mockInsert = vi.fn().mockReturnThis();
    const mockSingleInsert = vi.fn().mockResolvedValue({ data: mockCreatedProfile, error: null });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: mockSelect,
          eq: mockEq,
          single: mockSingleSelect,
          insert: mockInsert,
        };
      }
    });

    mockInsert.mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingleInsert }) });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockCreatedProfile);
  });

  it('should logout and clear state', async () => {
    // Set some initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { access_token: 'test' },
      loading: false,
    });

    supabase.auth.signOut.mockResolvedValue();

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should update profile on refreshProfile', async () => {
    useAuthStore.setState({ user: { id: '123' }, profile: { id: '123', full_name: 'Old Name' } });

    const mockUpdatedProfile = { id: '123', full_name: 'New Name' };
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUpdatedProfile, error: null })
    });

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockUpdatedProfile);
  });
});
