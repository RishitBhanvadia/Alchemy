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

  describe('logout', () => {
    it('should clear user data and sign out from Supabase', async () => {
      // Setup initial state
      useAuthStore.setState({
        user: { id: '123' },
        profile: { id: '123', name: 'Test' },
        session: { access_token: 'token' },
        loading: false,
        error: null,
      });

      // Call logout
      await useAuthStore.getState().logout();

      // Verify state was cleared
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Verify Supabase was called
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('init', () => {
    it('should handle unauthenticated session', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null }
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should load profile when session exists', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'token' };
      const mockProfile = { id: 'user123', full_name: 'Test User' };

      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession }
      });

      // Mock the chain: supabase.from('profiles').select('*').eq('id', 'user123').single()
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ select: mockSelect });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
