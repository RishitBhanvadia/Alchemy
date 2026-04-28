import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  const selectMock = vi.fn();
  const eqMock = vi.fn();
  const singleMock = vi.fn();
  const insertMock = vi.fn();

  const mockChain = {
    select: selectMock,
    eq: eqMock,
    single: singleMock,
    insert: insertMock
  };

  selectMock.mockReturnValue(mockChain);
  eqMock.mockReturnValue(mockChain);
  insertMock.mockReturnValue(mockChain);

  const fromMock = vi.fn().mockReturnValue(mockChain);

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn()
      },
      from: fromMock,
      __mocks__: {
        selectMock,
        eqMock,
        singleMock,
        insertMock,
      }
    }
  };
});

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
  });

  describe('init', () => {
    it('should initialize with session and fetch profile', async () => {
      const mockSession = { user: { id: 'user123', user_metadata: { full_name: 'Test User' } } };
      const mockProfile = { id: 'user123', full_name: 'Test User', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
      supabase.__mocks__.singleMock.mockResolvedValueOnce({ data: mockProfile, error: null });

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

    it('should handle no session gracefully', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set error if profile fetch fails unrecoverably', async () => {
      const mockSession = { user: { id: 'user123' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
      supabase.__mocks__.singleMock.mockResolvedValueOnce({ data: null, error: { message: 'Network error', code: '500' } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.error).toBe('Profile not found');
      expect(state.loading).toBe(false);
    });

    it('should create new profile if PGRST116 (not found) is returned', async () => {
      const mockSession = { user: { id: 'user123', email: 'test@example.com', user_metadata: { role: 'student' } } };
      const newProfile = { id: 'user123', full_name: 'test', display_name: 'test', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
      // First call fails with PGRST116
      supabase.__mocks__.singleMock.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      // Second call (insert -> select -> single) succeeds
      supabase.__mocks__.singleMock.mockResolvedValueOnce({ data: newProfile, error: null });

      await useAuthStore.getState().init();

      expect(supabase.__mocks__.insertMock).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.profile).toEqual(newProfile);
      expect(state.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('logout should clear user data and call supabase.auth.signOut', async () => {
      useAuthStore.setState({
        user: { id: '123' },
        profile: { full_name: 'John Doe' },
        session: { access_token: 'token' },
        loading: false,
        error: null
      });

      supabase.auth.signOut.mockResolvedValue();

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

  describe('refreshProfile', () => {
    it('should refresh profile data if user exists', async () => {
       useAuthStore.setState({
        user: { id: 'user123', user_metadata: {} },
      });

      const newProfile = { id: 'user123', full_name: 'Updated Name', role: 'student' };
      supabase.__mocks__.singleMock.mockResolvedValueOnce({ data: newProfile, error: null });

      await useAuthStore.getState().refreshProfile();

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(newProfile);
    });

    it('should do nothing if user is not set', async () => {
      await useAuthStore.getState().refreshProfile();
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });
});
