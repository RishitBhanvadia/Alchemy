import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('should initialize with null user when no session exists', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  it('should fetch profile and set user when session exists', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: 'user123', role: 'student', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      }),
    });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should create a new profile if PGRST116 error is returned', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', user_metadata: { full_name: 'New User' } };
    const mockSession = { user: mockUser };
    const newProfile = { id: 'user123', full_name: 'New User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValueOnce({ data: newProfile, error: null }),
            }),
          }),
        };
      }
    });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().profile).toEqual(newProfile);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('should clear user data on logout', async () => {
    useAuthStore.setState({
      user: { id: '123' },
      profile: { role: 'student' },
      session: {},
      loading: false,
    });

    supabase.auth.signOut.mockResolvedValue();

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
  });
});
