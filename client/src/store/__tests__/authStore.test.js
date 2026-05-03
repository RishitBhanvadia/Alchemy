import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';
import * as labStoreModule from '../labStore';

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

vi.mock('../labStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));

vi.mock('../historyStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));

vi.mock('../profileStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
}));

vi.mock('../classroomStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() })
  }
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

  describe('init', () => {
    it('handles initialization with no active session', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null }
      });
      supabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles initialization with an active session', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@test.com' }
      };
      const mockProfile = { id: '123', role: 'student', full_name: 'Test User' };

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession }
      });
      supabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles initialization with session but missing profile', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@test.com' }
      };

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession }
      });
      supabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile not found');
    });

    it('handles initialization error', async () => {
      supabase.auth.getSession.mockRejectedValueOnce(new Error('Session error'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Session error');
    });

    it('handles SIGNED_OUT auth state change', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      let callback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        callback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      await useAuthStore.getState().init();

      // Call the event listener mock
      if (callback) {
        await callback('SIGNED_OUT', null);
      }

      expect(window.location.href).toBe('/login');
    });

    it('handles SIGNED_IN auth state change with user', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      let callback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        callback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      const mockSession = { user: { id: '123' } };
      const mockProfile = { id: '123', name: 'Test' };

      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      if (callback) {
        await callback('SIGNED_IN', mockSession);
      }

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
    });

    it('handles TOKEN_REFRESHED auth state change with missing user', async () => {
      supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

      let callback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        callback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      // Clear out state before calling callback
      useAuthStore.setState({ user: null, profile: null, session: null });

      if (callback) {
        await callback('TOKEN_REFRESHED', { user: null });
      }

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('logout should clear user, profile, session, and set loading and error to false/null', async () => {
      useAuthStore.setState({
        user: { id: '1' },
        profile: { name: 'Test' },
        session: { access_token: '123' },
        loading: false,
        error: 'some error',
      });

      supabase.auth.signOut.mockResolvedValueOnce({});

      await useAuthStore.getState().logout();

      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('refreshProfile', () => {
    it('refreshProfile updates profile when user exists', async () => {
      useAuthStore.setState({
        user: { id: '123' },
        profile: { name: 'Old Name' }
      });

      const newProfile = { name: 'New Name' };
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValueOnce({ data: newProfile, error: null });

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        single: singleMock,
      });

      await useAuthStore.getState().refreshProfile();

      expect(useAuthStore.getState().profile).toEqual(newProfile);
    });

    it('refreshProfile does nothing when no user is set', async () => {
      useAuthStore.setState({
        user: null,
        profile: null
      });

      await useAuthStore.getState().refreshProfile();

      expect(supabase.from).not.toHaveBeenCalled();
      expect(useAuthStore.getState().profile).toBeNull();
    });
  });

  describe('fetchProfile (internal logic triggered via init or refresh)', () => {
    it('creates profile on PGRST116 error (not found)', async () => {
      useAuthStore.setState({ user: { id: '456', email: 'test@example.com' } });

      const selectMock1 = vi.fn().mockReturnThis();
      const eqMock1 = vi.fn().mockReturnThis();
      const singleMock1 = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const insertMock = vi.fn().mockReturnThis();
      const selectMock2 = vi.fn().mockReturnThis();
      const singleMock2 = vi.fn().mockResolvedValueOnce({ data: { id: '456', role: 'student' }, error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: selectMock1,
            eq: eqMock1,
            single: singleMock1,
            insert: insertMock,
          };
        }
      });

      insertMock.mockReturnValue({
        select: selectMock2,
      });
      selectMock2.mockReturnValue({
        single: singleMock2,
      });

      await useAuthStore.getState().refreshProfile();

      expect(insertMock).toHaveBeenCalled();
      expect(useAuthStore.getState().profile).toEqual({ id: '456', role: 'student' });
    });

    it('handles insert failure on PGRST116 fallback', async () => {
      useAuthStore.setState({ user: { id: '456', email: 'test@example.com' } });

      const selectMock1 = vi.fn().mockReturnThis();
      const eqMock1 = vi.fn().mockReturnThis();
      const singleMock1 = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const insertMock = vi.fn().mockReturnThis();
      const selectMock2 = vi.fn().mockReturnThis();
      const singleMock2 = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: 'INSERT_ERR' } });

      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: selectMock1,
            eq: eqMock1,
            single: singleMock1,
            insert: insertMock,
          };
        }
      });

      insertMock.mockReturnValue({
        select: selectMock2,
      });
      selectMock2.mockReturnValue({
        single: singleMock2,
      });

      // Clear console mock to avoid polluting test output if needed
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useAuthStore.getState().refreshProfile();

      expect(insertMock).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('[authStore] Failed to create profile:', 'Insert failed', 'INSERT_ERR');
      expect(useAuthStore.getState().profile).toBeNull(); // didn't change

      consoleSpy.mockRestore();
    });

    it('handles unhandled exception during fetchProfile', async () => {
      useAuthStore.setState({ user: { id: '456', email: 'test@example.com' } });

      supabase.from.mockImplementation(() => {
        throw new Error('Network failure');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useAuthStore.getState().refreshProfile();

      expect(consoleSpy).toHaveBeenCalledWith('[authStore] fetchProfile exception:', 'Network failure');
      expect(useAuthStore.getState().profile).toBeNull();

      consoleSpy.mockRestore();
    });
  });
});
