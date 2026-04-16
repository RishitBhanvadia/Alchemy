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

// Mock dynamic store dependencies per memory instructions
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../historyStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../profileStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
vi.mock('../classroomStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize successfully with no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logout gracefully and reset state', async () => {
    // Arrange: set a logged in user state
    useAuthStore.setState({
      user: { id: '123' },
      profile: { name: 'Test User' },
      session: { access_token: 'token' },
      loading: false
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

    // Act
    await useAuthStore.getState().logout();

    // Assert
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
