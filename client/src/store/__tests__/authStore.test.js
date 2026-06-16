import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock supabase client deeply
vi.mock('../../supabaseClient', () => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockInsert = vi.fn(() => ({ select: vi.fn(() => ({ single: mockSingle })) }));

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: mockSelect,
        insert: mockInsert,
      }))
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
      error: null,
    });
  });

  it('should initialize successfully with a user session and profile', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student', full_name: 'Test User' };

    // Set up getSession mock
    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
    });

    // Set up profile fetch mock chain
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = vi.fn(() => ({ single: mockSingle }));
    const mockSelect = vi.fn(() => ({ eq: mockEq }));
    supabase.from.mockImplementation(() => ({ select: mockSelect }));

    // Initialize store
    const store = useAuthStore.getState();
    await store.init();

    // Assertions
    const state = useAuthStore.getState();
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle unauthenticated user correctly on init', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const store = useAuthStore.getState();
    await store.init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should perform logout and clear state', async () => {
    supabase.auth.signOut.mockResolvedValue();

    // Set initial state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { id: '123' },
      session: { user: { id: '123' } },
      loading: false
    });

    const store = useAuthStore.getState();
    await store.logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
  });
});
