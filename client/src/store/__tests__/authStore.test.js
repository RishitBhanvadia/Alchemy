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

  describe('init()', () => {
    it('should set state to null if no user is found in session', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should fetch profile and update state when user is found in session', async () => {
      const mockSession = { user: { id: 'test-id' } };
      const mockProfile = { id: 'test-id', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      supabase.from.mockReturnValue({ select: mockSelect });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('logout()', () => {
    it('should call supabase.auth.signOut and clear state', async () => {
      // First populate some state
      useAuthStore.setState({
        user: { id: 'test' },
        profile: { name: 'test' },
        session: { token: 'xyz' },
        loading: false,
      });

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
});
