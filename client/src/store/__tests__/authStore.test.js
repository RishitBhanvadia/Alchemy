import { describe, it, expect, beforeEach, vi } from 'vitest';

const {
  mockGetSession,
  mockOnAuthStateChange,
  mockSignOut,
  mockEq,
  mockSelect,
  mockSingle,
  mockFrom
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockSignOut: vi.fn(),
  mockEq: vi.fn(),
  mockSelect: vi.fn(),
  mockSingle: vi.fn(),
  mockFrom: vi.fn()
}));

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        signOut: mockSignOut,
      },
      from: mockFrom
    }
  };
});

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

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) })
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('has default initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('init successfully handles session and fetches profile', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    const mockProfile = { id: '123', role: 'student' };

    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } }
    });

    mockSingle.mockResolvedValue({
      data: mockProfile,
      error: null
    });

    const store = useAuthStore.getState();
    await store.init();

    const state = useAuthStore.getState();
    expect(mockGetSession).toHaveBeenCalled();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('init handles no session', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null }
    });

    const store = useAuthStore.getState();
    await store.init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('logout correctly clears state and calls signOut', async () => {
    useAuthStore.setState({
      user: { id: '123' },
      profile: { role: 'student' },
      session: { access_token: '123' },
      loading: false,
    });

    const store = useAuthStore.getState();
    await store.logout();

    const state = useAuthStore.getState();
    expect(mockSignOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });
});
