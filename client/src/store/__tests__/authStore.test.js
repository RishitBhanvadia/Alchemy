import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

// Mock other stores to prevent errors from deferred imports
vi.mock('../labStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() }),
  },
}));
vi.mock('../historyStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() }),
  },
}));
vi.mock('../profileStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() }),
  },
}));
vi.mock('../classroomStore', () => ({
  default: {
    getState: () => ({ reset: vi.fn() }),
  },
}));

import { supabase } from '../../supabaseClient';
import useAuthStore from '../authStore';

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

    // Default mock implementation
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    // Default implementation for onAuthStateChange
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  it('initilizes with empty state when no session is present', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('initializes with session and fetches profile when session exists', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123' };
    const mockProfile = { id: 'user123', role: 'student', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock fetchProfile implementation via supabase.from
    const selectMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    supabase.from.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      single: singleMock,
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.session).toEqual(mockSession);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  it('handles profile missing with an error state', async () => {
    const mockUser = { id: 'user123' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock profile fetch failing / returning null
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER_ERROR' } });

    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toBeNull();
    expect(state.error).toBe('Profile not found');
  });

  it('logout signs out from supabase and resets state', async () => {
    // Set some initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { role: 'student' },
      session: { token: 'abc' },
      loading: false,
      error: null,
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

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
