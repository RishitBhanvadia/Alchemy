import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
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

describe('authStore', () => {
  beforeEach(() => {
    // Reset Zustand store state
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('initial state should be empty with loading true', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  describe('init()', () => {
    it('should set state to logged out if no session is returned', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set user and profile when session is valid and profile exists', async () => {
      const mockSession = { user: { id: '123', email: 'test@test.com' } };
      const mockProfile = { id: '123', full_name: 'Test User' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle session with user but failed profile fetch gracefully', async () => {
      const mockSession = { user: { id: '123', email: 'test@test.com' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Some error' } });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile not found');
    });

    it('should handle getSession error', async () => {
      supabase.auth.getSession.mockRejectedValue(new Error('Network error'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('logout()', () => {
    it('should sign out from supabase and clear state', async () => {
      // Setup initial logged-in state
      useAuthStore.setState({
        user: { id: '123' },
        profile: { id: '123' },
        session: { access_token: 'token' },
        loading: false,
        error: null,
      });

      supabase.auth.signOut.mockResolvedValue();

      await useAuthStore.getState().logout();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchProfile logic (triggered by init and refreshProfile)', () => {
    it('should create a profile if it is not found (PGRST116)', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        user_metadata: { full_name: 'Test Full Name', role: 'student' }
      };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }) // first single()
        .mockResolvedValueOnce({ data: { id: '123', full_name: 'Test Full Name' }, error: null }); // second single() after insert
      const mockInsert = vi.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
        insert: mockInsert
      });

      await useAuthStore.getState().init();

      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUser.id,
        full_name: mockUser.user_metadata.full_name,
        display_name: mockUser.user_metadata.full_name,
        role: mockUser.user_metadata.role,
        avatar_url: null
      });

      const state = useAuthStore.getState();
      expect(state.profile).toEqual({ id: '123', full_name: 'Test Full Name' });
    });

    it('should handle insert error during profile creation', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
        user_metadata: { full_name: 'Test Full Name', role: 'student' }
      };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } })
        .mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: 'INSERT_ERR' } });
      const mockInsert = vi.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
        insert: mockInsert
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useAuthStore.getState().init();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[authStore] Failed to create profile:',
        'Insert failed',
        'INSERT_ERR'
      );

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
      expect(state.error).toBe('Profile not found');

      consoleErrorSpy.mockRestore();
    });

    it('should refresh profile successfully', async () => {
      const mockUser = { id: '123', user_metadata: { full_name: 'Refreshed' } };
      useAuthStore.setState({ user: mockUser });

      const mockProfile = { id: '123', full_name: 'Refreshed Profile' };
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      });

      await useAuthStore.getState().refreshProfile();

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(mockProfile);
    });

    it('should return early from refreshProfile if no user is set', async () => {
      useAuthStore.setState({ user: null, profile: { old: 'data' } });
      await useAuthStore.getState().refreshProfile();
      expect(useAuthStore.getState().profile).toEqual({ old: 'data' });
    });
  });

  describe('auth state change handling', () => {
    it('should handle SIGNED_OUT event', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      // Set up onAuthStateChange to immediately invoke callback with SIGNED_OUT
      supabase.auth.onAuthStateChange.mockImplementation(async (callback) => {
        await callback('SIGNED_OUT', null);
      });

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      const logoutSpy = vi.spyOn(useAuthStore.getState(), 'logout');

      await useAuthStore.getState().init();

      expect(logoutSpy).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');

      // Restore window.location
      window.location = originalLocation;
    });

    it('should handle SIGNED_IN event and fetch profile', async () => {
      // Mock initial getSession to return null to avoid conflict
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      const mockSession = { user: { id: '123', email: 'test@test.com' } };
      const mockProfile = { id: '123', name: 'Test' };

      supabase.auth.onAuthStateChange.mockImplementation(async (callback) => {
        await callback('SIGNED_IN', mockSession);
      });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      });

      await useAuthStore.getState().init();

      // Wait a tick for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
    });
  });

  describe('fetchProfile exception handling', () => {
    it('should handle general exceptions in fetchProfile gracefully', async () => {
      const mockUser = { id: '123' };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected DB Error');
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useAuthStore.getState().init();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[authStore] fetchProfile exception:',
        'Unexpected DB Error'
      );

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
      expect(state.error).toBe('Profile not found');

      consoleErrorSpy.mockRestore();
    });
  });
});
