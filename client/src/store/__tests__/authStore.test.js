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
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  describe('init', () => {
    it('should handle existing session with profile', async () => {
      const mockSession = { user: { id: 'user123', email: 'test@test.com' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const mockProfile = { id: 'user123', role: 'student' };
      const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from.mockReturnValue({ select: selectMock });

      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle missing session', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should sign out and clear state', async () => {
      useAuthStore.setState({
        user: { id: 'user123' },
        profile: { id: 'user123' },
        session: { access_token: '123' }
      });

      supabase.auth.signOut.mockResolvedValue();

      await useAuthStore.getState().logout();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
    });
  });
});
