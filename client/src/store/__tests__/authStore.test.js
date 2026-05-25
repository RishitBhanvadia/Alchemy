import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
vi.mock('../../supabaseClient', () => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq, single: mockSingle }));
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: vi.fn(() => ({ select: mockSelect })),
  }));

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: mockFrom,
    }
  };
});

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state
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
    it('should set user and profile if session exists and profile is found', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { id: '123', full_name: 'Test User' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      // Mock supabase.from().select().eq().single() to return mockProfile
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      supabase.from.mockReturnValue({ select: mockSelect });

      // Run init
      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and clear state if no session exists', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should handle session with no profile found', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { user: mockUser };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      // Mock profile fetch error
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      supabase.from.mockReturnValue({ select: mockSelect });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toBeNull();
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile not found');
    });
  });

  describe('logout', () => {
    it('should clear state and call supabase.auth.signOut', async () => {
      // Set initial state
      useAuthStore.setState({
        user: { id: '123' },
        profile: { name: 'Test' },
        session: { token: 'abc' },
        loading: false,
        error: null,
      });

      supabase.auth.signOut.mockResolvedValue({ error: null });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
