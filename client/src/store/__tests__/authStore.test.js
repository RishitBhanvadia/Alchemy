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
    }
  };
});

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123', full_name: 'Test User' },
      session: { access_token: 'token' },
      loading: false,
      error: null
    });
  });

  describe('logout', () => {
    it('should sign out from supabase and clear local state', async () => {
      supabase.auth.signOut.mockResolvedValueOnce({ error: null });

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

  describe('init', () => {
    it('should initialize store with user profile when session exists', async () => {
      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', full_name: 'Test User' };

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession }
      });

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });

      supabase.from.mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      await useAuthStore.getState().init();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(supabase.from).toHaveBeenCalledWith('profiles');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle getSession error', async () => {
      supabase.auth.getSession.mockRejectedValueOnce(new Error('Session error'));
      await useAuthStore.getState().init();
      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Session error');
    });

    it('should set error to Profile not found when session exists but fetchProfile returns null', async () => {
      const mockSession = { user: { id: 'user-123' } };
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Network error', code: '500' } });
      supabase.from.mockReturnValueOnce({ select: selectMock, eq: eqMock, single: singleMock });

      const originalConsoleError = console.error;
      console.error = vi.fn();
      await useAuthStore.getState().init();
      console.error = originalConsoleError;

      const state = useAuthStore.getState();
      expect(state.error).toBe('Profile not found');
    });

    it('should handle onAuthStateChange SIGNED_OUT event', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      let callback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        callback = cb;
      });

      await useAuthStore.getState().init();

      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      const logoutSpy = vi.spyOn(useAuthStore.getState(), 'logout');
      logoutSpy.mockImplementation(() => {});

      await callback('SIGNED_OUT', null);

      expect(logoutSpy).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');

      window.location = originalLocation;
    });

    it('should handle onAuthStateChange SIGNED_IN event with profile fetching', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      let callback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        callback = cb;
      });

      await useAuthStore.getState().init();

      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', full_name: 'Test User' };

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      supabase.from.mockReturnValueOnce({ select: selectMock, eq: eqMock, single: singleMock });

      await callback('SIGNED_IN', mockSession);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
    });
  });

  describe('refreshProfile', () => {
    it('should return early if user is null', async () => {
      useAuthStore.setState({ user: null });
      supabase.from.mockClear();
      await useAuthStore.getState().refreshProfile();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch and set profile if user exists', async () => {
      useAuthStore.setState({ user: { id: 'user-123', user_metadata: { full_name: 'Meta Name' } } });
      const mockProfile = { id: 'user-123', full_name: 'Meta Name' };

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      supabase.from.mockReturnValueOnce({ select: selectMock, eq: eqMock, single: singleMock });

      await useAuthStore.getState().refreshProfile();

      expect(useAuthStore.getState().profile).toEqual(mockProfile);
    });
  });

  describe('fetchProfile edge cases', () => {
    it('should create profile when single returns PGRST116', async () => {
      useAuthStore.setState({ user: { id: 'user-123', email: 'test@example.com' } });

      const selectMock1 = vi.fn().mockReturnThis();
      const eqMock1 = vi.fn().mockReturnThis();
      const singleMock1 = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const insertMock = vi.fn().mockReturnThis();
      const selectMock2 = vi.fn().mockReturnThis();
      const singleMock2 = vi.fn().mockResolvedValueOnce({ data: { id: 'user-123', full_name: 'test' }, error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          if (insertMock.mock.calls.length === 0 && selectMock1.mock.calls.length === 0) {
             return { select: selectMock1, eq: eqMock1, single: singleMock1, insert: insertMock };
          } else {
             return { insert: insertMock, select: selectMock2, single: singleMock2 };
          }
        }
      });

      await useAuthStore.getState().refreshProfile();
      expect(useAuthStore.getState().profile).toEqual({ id: 'user-123', full_name: 'test' });
    });

    it('should handle insert failure when single returns PGRST116', async () => {
      useAuthStore.setState({ user: { id: 'user-123', email: 'test@example.com' } });

      const selectMock1 = vi.fn().mockReturnThis();
      const eqMock1 = vi.fn().mockReturnThis();
      const singleMock1 = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const insertMock = vi.fn().mockReturnThis();
      const selectMock2 = vi.fn().mockReturnThis();
      const singleMock2 = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: '500' } });

      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          if (insertMock.mock.calls.length === 0 && selectMock1.mock.calls.length === 0) {
             return { select: selectMock1, eq: eqMock1, single: singleMock1, insert: insertMock };
          } else {
             return { insert: insertMock, select: selectMock2, single: singleMock2 };
          }
        }
      });

      const originalConsoleError = console.error;
      console.error = vi.fn();
      await useAuthStore.getState().refreshProfile();
      console.error = originalConsoleError;

      // profile remains unchanged because refreshProfile only sets if profile is not null
    });

    it('should handle exception thrown in fetchProfile', async () => {
      useAuthStore.setState({ user: { id: 'user-123' } });

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockRejectedValueOnce(new Error('Fetch failed'));
      supabase.from.mockReturnValueOnce({ select: selectMock, eq: eqMock, single: singleMock });

      const originalConsoleError = console.error;
      console.error = vi.fn();
      await useAuthStore.getState().refreshProfile();
      console.error = originalConsoleError;
    });
  });
});
