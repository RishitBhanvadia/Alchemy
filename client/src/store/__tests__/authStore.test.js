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

// Mock the dependent stores to avoid initialization issues
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../historyStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../profileStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../classroomStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));

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

  it('should initialize with no user if session is empty', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should initialize with user and fetch profile if session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));

    // Mock the profile fetch
    const selectMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: selectMock, eq: eqMock, single: singleMock };
      }
      return {};
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle missing profile when session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }));

    // Mock profile fetch failing with PGRST116 (not found) and insert also failing
    const selectMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

    const insertMock = vi.fn().mockReturnThis();
    const selectInsertMock = vi.fn().mockReturnThis();
    const singleInsertMock = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: selectMock,
          eq: eqMock,
          single: singleMock,
          insert: () => ({ select: () => ({ single: singleInsertMock }) })
        };
      }
      return {};
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toBeNull();
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Profile not found');
  });

  it('should clear state on logout', async () => {
    // Set some initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { user: { id: '123' } },
      loading: false,
      error: null,
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
