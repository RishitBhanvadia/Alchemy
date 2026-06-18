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

  it('should initialize with no user if session is empty', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should initialize with user and fetch profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', role: 'student' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: mockEq,
      single: mockSingle,
    });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should handle profile creation if missing (PGRST116)', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User', role: 'student' }
    };
    const mockSession = { user: mockUser };
    const newProfile = { id: '123', full_name: 'Test User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

    const mockInsertSelect = vi.fn().mockReturnThis();
    const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: newProfile, error: null });
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect, single: mockInsertSingle });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: mockEq,
          single: mockSingle,
          insert: mockInsert,
        };
      }
    });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(newProfile);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      id: '123',
      full_name: 'Test User',
      role: 'student'
    }));
  });

  it('should handle logout', async () => {
    useAuthStore.setState({
      user: { id: '1' },
      profile: { name: 'Test' },
      session: { token: 'abc' },
      loading: false,
      error: 'Some error'
    });

    supabase.auth.signOut.mockResolvedValue({});

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle auth state change - SIGNED_OUT', async () => {
    useAuthStore.setState({
      user: { id: '1' },
      profile: { name: 'Test' }
    });

    let callback;
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      callback = cb;
    });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();
    await callback('SIGNED_OUT', null);

    expect(window.location.href).toBe('/login');

    window.location = originalLocation;
  });
});
