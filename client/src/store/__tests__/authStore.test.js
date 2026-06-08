import { describe, it, expect, beforeEach, vi } from 'vitest';
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
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('init', () => {
    it('should set user, profile, and session on successful init with existing profile', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { id: '123', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from.mockReturnValue({ select: selectMock });

      supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle null session', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
      supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle session with no profile (creates new profile)', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { user: mockUser };
      const newProfile = { id: '123', full_name: 'Unknown User' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const singleSelectMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      const eqSelectMock = vi.fn().mockReturnValue({ single: singleSelectMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqSelectMock });

      const singleInsertMock = vi.fn().mockResolvedValue({ data: newProfile, error: null });
      const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

      supabase.from.mockImplementation((table) => {
        return {
          select: selectMock,
          insert: insertMock,
        };
      });

      supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(newProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle error in fetching profile', async () => {
        const mockUser = { id: '123', email: 'test@test.com' };
        const mockSession = { user: mockUser };

        supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

        const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
        const eqMock = vi.fn().mockReturnValue({ single: singleMock });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        supabase.from.mockReturnValue({ select: selectMock });

        supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

        await useAuthStore.getState().init();

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.profile).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Profile not found');
    });

    it('should handle getSession error', async () => {
      supabase.auth.getSession.mockRejectedValue(new Error('Auth Error'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Auth Error');
    });
  });

  describe('logout', () => {
    it('should call supabase signOut and clear state', async () => {
      supabase.auth.signOut.mockResolvedValue();
      useAuthStore.setState({
        user: { id: '1' },
        profile: { id: '1' },
        session: { user: { id: '1' } },
        loading: false,
        error: null,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('refreshProfile', () => {
    it('should update profile if user exists', async () => {
        const mockUser = { id: '123', email: 'test@test.com' };
        useAuthStore.setState({ user: mockUser, profile: { role: 'old_role' } });

        const updatedProfile = { id: '123', role: 'new_role' };

        const singleMock = vi.fn().mockResolvedValue({ data: updatedProfile, error: null });
        const eqMock = vi.fn().mockReturnValue({ single: singleMock });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        supabase.from.mockReturnValue({ select: selectMock });

        await useAuthStore.getState().refreshProfile();

        expect(useAuthStore.getState().profile).toEqual(updatedProfile);
    });

    it('should do nothing if user does not exist', async () => {
        useAuthStore.setState({ user: null, profile: null });
        await useAuthStore.getState().refreshProfile();
        expect(useAuthStore.getState().profile).toBeNull();
        expect(supabase.from).not.toHaveBeenCalled();
    });
  });
});
  describe('auth state changes', () => {
    it('should handle SIGNED_OUT event', async () => {
      let authStateCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      Object.defineProperty(window, 'location', {
        value: { href: 'http://localhost/' },
        writable: true,
      });

      const logoutSpy = vi.spyOn(useAuthStore.getState(), 'logout').mockResolvedValue();

      await authStateCallback('SIGNED_OUT', null);

      expect(logoutSpy).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    });

    it('should handle SIGNED_IN event with user', async () => {
      let authStateCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const mockUser = { id: '456' };
      const mockSession = { user: mockUser };
      const mockProfile = { id: '456', role: 'teacher' };

      const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from.mockReturnValue({ select: selectMock });

      await authStateCallback('SIGNED_IN', mockSession);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
    });
  });

  describe('fetchProfile exceptions', () => {
    it('should handle fetch profile exception gracefully', async () => {
      const mockUser = { id: '123' };
      const mockSession = { user: mockUser };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected Error');
      });

      supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toBeNull();
      expect(state.error).toBe('Profile not found');
    });

    it('should handle insert profile error gracefully', async () => {
      const mockUser = { id: '123' };
      const mockSession = { user: mockUser };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const singleSelectMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      const eqSelectMock = vi.fn().mockReturnValue({ single: singleSelectMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqSelectMock });

      const singleInsertMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert Error', code: '500' } });
      const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

      supabase.from.mockImplementation(() => {
        return {
          select: selectMock,
          insert: insertMock,
        };
      });

      supabase.auth.onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toBeNull();
      expect(state.error).toBe('Profile not found');
    });
  });
