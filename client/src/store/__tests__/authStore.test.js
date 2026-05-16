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
  }
}));

// Mock dynamic imports to prevent unhandled rejections during logout test
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../historyStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../profileStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../classroomStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));

// Need to mock window.location.href assignment
const originalWindowLocation = window.location;

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });

    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  describe('init', () => {
    it('should initialize with no user if no session exists', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should fetch profile and set state when session exists', async () => {
      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', role: 'student' };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.session).toEqual(mockSession);
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should set error if fetching profile fails during init', async () => {
      const mockSession = { user: { id: 'user-123' } };

      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      const mockEq = vi.fn().mockReturnThis();
      // Simulating a general error
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch error', code: 'XXX' } });
      supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
      expect(state.error).toBe('Profile not found');
    });

    it('should handle auth state change: SIGNED_OUT', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      // Manually trigger SIGNED_OUT event
      await authCallback('SIGNED_OUT', null);

      expect(window.location.href).toBe('/login');
    });

    it('should handle auth state change: SIGNED_IN', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', role: 'student' };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

      // Manually trigger SIGNED_IN event
      await authCallback('SIGNED_IN', mockSession);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
    });
  });

  describe('logout', () => {
    it('should call signOut and clear state', async () => {
      useAuthStore.setState({ user: { id: 'user-123' }, session: {}, profile: {}, loading: false });
      supabase.auth.signOut.mockResolvedValue({ error: null });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('refreshProfile', () => {
    it('should do nothing if no user is set', async () => {
      await useAuthStore.getState().refreshProfile();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch and update profile if user exists', async () => {
       useAuthStore.setState({ user: { id: 'user-123' }, profile: null });

       const mockProfile = { id: 'user-123', role: 'teacher' };
       const mockEq = vi.fn().mockReturnThis();
       const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
       supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

       await useAuthStore.getState().refreshProfile();

       const state = useAuthStore.getState();
       expect(state.profile).toEqual(mockProfile);
    });
  });

  describe('fetchProfile missing profile fallback', () => {
    it('should attempt to create a profile if PGRST116 (not found) is returned', async () => {
       useAuthStore.setState({ user: { id: 'user-123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } }, profile: null });

       const mockEq = vi.fn().mockReturnThis();
       // Return PGRST116 first to simulate missing profile
       const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'Not found' } });

       // Setup insert mock
       const mockInsertSelect = vi.fn().mockReturnThis();
       const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: { id: 'user-123', full_name: 'Test User', role: 'student' }, error: null });

       supabase.from.mockImplementation((table) => {
         if (table === 'profiles') {
           return {
             select: vi.fn().mockReturnThis(),
             eq: mockEq,
             single: mockSingle,
             insert: vi.fn().mockReturnValue({ select: mockInsertSelect, single: mockInsertSingle })
           };
         }
       });

       await useAuthStore.getState().refreshProfile();

       const state = useAuthStore.getState();
       expect(state.profile).toEqual({ id: 'user-123', full_name: 'Test User', role: 'student' });
    });

    it('should handle insert failure gracefully', async () => {
       useAuthStore.setState({ user: { id: 'user-123', email: 'test@example.com' }, profile: null });

       const mockEq = vi.fn().mockReturnThis();
       // Return PGRST116 first to simulate missing profile
       const mockSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'Not found' } });

       // Setup insert mock to fail
       const mockInsertSelect = vi.fn().mockReturnThis();
       const mockInsertSingle = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Insert failed', code: '500' } });

       supabase.from.mockImplementation((table) => {
         if (table === 'profiles') {
           return {
             select: vi.fn().mockReturnThis(),
             eq: mockEq,
             single: mockSingle,
             insert: vi.fn().mockReturnValue({ select: mockInsertSelect, single: mockInsertSingle })
           };
         }
       });

       await useAuthStore.getState().refreshProfile();

       const state = useAuthStore.getState();
       expect(state.profile).toBeNull();
    });

    it('should handle general exception in fetchProfile', async () => {
       useAuthStore.setState({ user: { id: 'user-123', email: 'test@example.com' }, profile: null });

       const mockEq = vi.fn().mockReturnThis();
       const mockSingle = vi.fn().mockRejectedValueOnce(new Error('Network error'));

       supabase.from.mockImplementation((table) => {
         if (table === 'profiles') {
           return {
             select: vi.fn().mockReturnThis(),
             eq: mockEq,
             single: mockSingle,
           };
         }
       });

       await useAuthStore.getState().refreshProfile();

       const state = useAuthStore.getState();
       expect(state.profile).toBeNull();
    });
  });

  describe('init error handling', () => {
    it('should handle exception during init', async () => {
      supabase.auth.getSession.mockRejectedValue(new Error('Auth failed'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Auth failed');
    });
  });

  describe('auth state change additional cases', () => {
    it('should handle auth state change: TOKEN_REFRESHED with user', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      const mockSession = { user: { id: 'user-123' } };
      const mockProfile = { id: 'user-123', role: 'student' };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

      // Manually trigger TOKEN_REFRESHED event
      await authCallback('TOKEN_REFRESHED', mockSession);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
    });

    it('should handle auth state change: TOKEN_REFRESHED without user', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      const mockSession = { user: null };

      // Manually trigger TOKEN_REFRESHED event without user
      await authCallback('TOKEN_REFRESHED', mockSession);

      const state = useAuthStore.getState();
      // Should remain null as we don't set anything
      expect(state.user).toBeNull();
    });
  });

  describe('fetchProfile handling profile null user scenario', () => {
    it('should ignore fetching when user is null during init handleSession', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: { user: null } } });
      supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchProfile handling profile fetch error log branch', () => {
    it('should log error and return null if fetch fails with a generic error (not PGRST116)', async () => {
      // Need to reset mock for this specific branch
      supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      let authCallback;
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      await useAuthStore.getState().init();

      const mockSession = { user: { id: 'user-123' } };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Some other error', code: '123' } });
      supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), eq: mockEq, single: mockSingle });

      // Manually trigger SIGNED_IN event to hit fetchProfile again without the specific init logic catching it directly
      await authCallback('SIGNED_IN', mockSession);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
    });
  });
});
