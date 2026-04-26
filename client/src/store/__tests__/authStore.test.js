import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
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

  describe('logout', () => {
    it('should clear session state and call supabase signOut', async () => {
      useAuthStore.setState({
        user: { id: '123' },
        profile: { role: 'teacher' },
        session: { access_token: 'token' },
        loading: false,
        error: 'some error',
      });
      supabase.auth.signOut.mockResolvedValue({});

      await useAuthStore.getState().logout();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('init', () => {
    it('should handle missing session and stop loading', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      await useAuthStore.getState().init();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should fetch profile and set state on valid session', async () => {
      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

      await useAuthStore.getState().init();

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle missing profile', async () => {
      const mockSession = { user: { id: 'user-123' } };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

      await useAuthStore.getState().init();

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile not found');
    });

    it('should handle error when fetching session', async () => {
      const mockError = new Error('Network failure');
      supabase.auth.getSession.mockRejectedValue(mockError);

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network failure');
    });

    it('should set up auth state change listener', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      await useAuthStore.getState().init();

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });

  describe('refreshProfile', () => {
    it('should do nothing if no user is present', async () => {
      await useAuthStore.getState().refreshProfile();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch profile and update state when user is present', async () => {
      const mockUser = { id: 'user-456' };
      const mockProfile = { id: 'user-456', role: 'teacher' };

      useAuthStore.setState({ user: mockUser });

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle });

      await useAuthStore.getState().refreshProfile();

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-456');
      const state = useAuthStore.getState();
      expect(state.profile).toEqual(mockProfile);
    });
  });
});
