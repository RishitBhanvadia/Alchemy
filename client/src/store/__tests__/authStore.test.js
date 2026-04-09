import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockInsert = vi.fn().mockReturnThis();

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      insert: mockInsert,
    })),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await useAuthStore.getState().init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should initialize with a session and existing profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockProfile = { id: '123', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
  });

  it('should initialize with a session and create a profile if PGRST116 error occurs', async () => {
    const mockUser = { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Test User', role: 'student' } };
    const mockSession = { user: mockUser, access_token: 'token' };
    const mockProfile = { id: '123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

    // First call to single() simulates not finding a profile
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    // Second call to single() simulates successful insert returning the profile
    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
  });

  it('should handle logout', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });
    useAuthStore.setState({ user: { id: '123' }, profile: { id: '123' }, session: { user: { id: '123' } }, loading: false });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });

  it('should refresh profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', full_name: 'Updated User' };

    useAuthStore.setState({ user: mockUser });
    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    await useAuthStore.getState().refreshProfile();

    expect(mockSingle).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
  });

  it('should not refresh profile if user is not set', async () => {
    await useAuthStore.getState().refreshProfile();
    expect(mockSelect).not.toHaveBeenCalled();
  });
});
