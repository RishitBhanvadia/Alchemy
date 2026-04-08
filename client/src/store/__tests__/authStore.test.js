import { describe, it, expect, beforeEach, vi } from 'vitest';
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
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null
    });

    // Default mocks
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  describe('init', () => {
    it('should set loading to false and clear state when no session exists', async () => {
      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set user and profile when session exists', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { id: '123', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: singleMock
          })
        })
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle PGRST116 (profile not found) and create a default profile', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { user: mockUser };
      const newProfile = { id: '123', full_name: 'test', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const singleMock = vi.fn()
        // First call fails with PGRST116
        .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } })
        // Second call (insert) succeeds
        .mockResolvedValueOnce({ data: newProfile, error: null });

      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: singleMock
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: singleMock
          })
        })
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(newProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles'); // One for select, one for insert
      // Note: we might not be able to easily test the exact calls due to the mock setup,
      // but verifying the state is set correctly confirms the fallback logic executed.
    });
  });

  describe('logout', () => {
    it('should clear user, profile and session state', async () => {
      useAuthStore.setState({
        user: { id: '1' },
        profile: { name: 'Test' },
        session: { access_token: '123' },
        loading: false,
        error: null
      });

      supabase.auth.signOut.mockResolvedValue();

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
