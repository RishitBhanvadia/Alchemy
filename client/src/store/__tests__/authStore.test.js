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
    it('should call supabase signOut and clear user session', async () => {
      // Arrange
      supabase.auth.signOut.mockResolvedValue({ error: null });
      useAuthStore.setState({
        user: { id: '123' },
        profile: { name: 'Test' },
        session: { access_token: 'token' },
        loading: false,
        error: null,
      });

      // Act
      await useAuthStore.getState().logout();

      // Assert
      const state = useAuthStore.getState();
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
    });
  });

  describe('init', () => {
    it('should clear user session if getSession returns no user', async () => {
      // Arrange
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      // Act
      await useAuthStore.getState().init();

      // Assert
      const state = useAuthStore.getState();
      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('refreshProfile', () => {
    it('should not refresh profile if user id is missing', async () => {
      // Arrange
      useAuthStore.setState({ user: null });

      // Act
      await useAuthStore.getState().refreshProfile();

      // Assert
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should refresh profile if user id is present', async () => {
      // Arrange
      useAuthStore.setState({ user: { id: '123' } });
      const mockSingle = vi.fn().mockResolvedValue({ data: { id: '123', name: 'Test' }, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ select: mockSelect });

      // Act
      await useAuthStore.getState().refreshProfile();

      // Assert
      const state = useAuthStore.getState();
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(state.profile).toEqual({ id: '123', name: 'Test' });
    });
  });

  describe('init handleSession with user', () => {
    it('should set user and profile if session has user', async () => {
      // Arrange
      const mockUser = { id: '123' };
      const mockProfile = { id: '123', name: 'Test' };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ select: mockSelect });

      // Act
      await useAuthStore.getState().init();

      // Assert
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });


  describe('auth events', () => {
    it('should call logout and redirect on SIGNED_OUT', async () => {
      const mockLogout = vi.fn();
      useAuthStore.setState({ logout: mockLogout });

      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let onAuthStateChangeCallback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        onAuthStateChangeCallback = cb;
      });

      await useAuthStore.getState().init();

      // Trigger the callback
      await onAuthStateChangeCallback('SIGNED_OUT');

      expect(mockLogout).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');

      window.location = originalLocation;
    });

    it('should set user and profile on SIGNED_IN', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let onAuthStateChangeCallback;
      supabase.auth.onAuthStateChange.mockImplementation((cb) => {
        onAuthStateChangeCallback = cb;
      });

      await useAuthStore.getState().init();

      const mockUser = { id: '123' };
      const mockProfile = { id: '123', name: 'Test2' };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ select: mockSelect });

      // Trigger the callback
      await onAuthStateChangeCallback('SIGNED_IN', { user: mockUser });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.profile).toEqual(mockProfile);
    });
  });

  describe('fetchProfile edge cases', () => {
    it('should create profile on PGRST116 error', async () => {
      const mockUser = { id: '123', email: 'test@example.com', user_metadata: { role: 'student' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      // First call (select) returns PGRST116
      const mockSingleSelect = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingleSelect });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      // Second call (insert) returns the new profile
      const newProfile = { id: '123', full_name: 'test', display_name: 'test', role: 'student', avatar_url: null };
      const mockSingleInsert = vi.fn().mockResolvedValue({ data: newProfile, error: null });
      const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingleInsert });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

      supabase.from.mockReturnValue({ select: mockSelect, insert: mockInsert });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(newProfile);
    });
  });


  describe('fetchProfile fetch error', () => {
    it('should return null on select error', async () => {
      const mockUser = { id: '123' };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Network error' } });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ select: mockSelect });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
    });

    it('should return null on profile creation error (insert error)', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      // Select returns PGRST116 (not found)
      const mockSingleSelect = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingleSelect });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      // Insert fails
      const mockSingleInsert = vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } });
      const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingleInsert });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

      supabase.from.mockReturnValue({ select: mockSelect, insert: mockInsert });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
    });
  });


  describe('fetchProfile fetch exception', () => {
    it('should return null on exception', async () => {
      const mockUser = { id: '123' };
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
    });
  });

  describe('init error handling', () => {
    it('should set error on init exception', async () => {
      supabase.auth.getSession.mockRejectedValue(new Error('Auth failed'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.error).toBe('Auth failed');
      expect(state.loading).toBe(false);
    });
  });
});
