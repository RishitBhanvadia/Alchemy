import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';

// Mock Supabase
const {
  mockFrom,
  mockSelect,
  mockEq,
  mockSingle,
  mockInsert,
  mockGetSession,
  mockOnAuthStateChange,
  mockSignOut
} = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockSelect: vi.fn(),
  mockEq: vi.fn(),
  mockSingle: vi.fn(),
  mockInsert: vi.fn(),
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockSignOut: vi.fn()
}));

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      from: mockFrom,
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        signOut: mockSignOut
      }
    }
  };
});

// Chaining
mockFrom.mockReturnValue({
  select: mockSelect,
  insert: mockInsert
});

mockSelect.mockReturnValue({
  eq: mockEq,
  single: mockSingle
});

mockEq.mockReturnValue({
  single: mockSingle
});

mockInsert.mockReturnValue({
  select: mockSelect
});


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

  describe('init', () => {
    it('handles session successfully with user profile', async () => {
      const mockSession = { user: { id: '123', email: 'test@example.com' } };
      const mockProfile = { id: '123', full_name: 'Test User' };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      await useAuthStore.getState().init();

      expect(mockGetSession).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockEq).toHaveBeenCalledWith('id', '123');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toEqual(mockProfile);
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles session when profile is missing', async () => {
      const mockSession = { user: { id: '123', email: 'test@example.com' } };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockSingle.mockResolvedValue({ data: null, error: { code: 'OTHER' } }); // Not PGRST116

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockSession.user);
      expect(state.profile).toBeNull();
      expect(state.session).toEqual(mockSession);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile not found');
    });

    it('handles no session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles session failure', async () => {
        mockGetSession.mockRejectedValue(new Error('Network error'));

        await useAuthStore.getState().init();

        const state = useAuthStore.getState();
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
    });
  });

  describe('logout', () => {
    it('clears state and calls supabase signOut', async () => {
      // Set some initial state
      useAuthStore.setState({
        user: { id: '123' },
        profile: { name: 'Test' },
        session: { token: 'abc' },
        loading: false,
        error: null,
      });

      mockSignOut.mockResolvedValue();

      await useAuthStore.getState().logout();

      expect(mockSignOut).toHaveBeenCalled();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.session).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('refreshProfile', () => {
    it('updates profile successfully', async () => {
      useAuthStore.setState({
        user: { id: '123', user_metadata: { full_name: 'Metadata Name' } }
      });

      const newProfile = { id: '123', full_name: 'Updated Name' };
      mockSingle.mockResolvedValue({ data: newProfile, error: null });

      await useAuthStore.getState().refreshProfile();

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockEq).toHaveBeenCalledWith('id', '123');

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(newProfile);
    });

    it('does nothing if user is null', async () => {
      useAuthStore.setState({ user: null });

      await useAuthStore.getState().refreshProfile();

      expect(mockFrom).not.toHaveBeenCalled();
    });
  });
});
