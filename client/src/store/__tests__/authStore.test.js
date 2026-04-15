import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock dependent stores to prevent cross-store import crashes
vi.mock('../labStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) },
}));
vi.mock('../historyStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) },
}));
vi.mock('../profileStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) },
}));
vi.mock('../classroomStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'test-user-id' },
      profile: { id: 'test-user-id', role: 'student' },
      session: { access_token: 'test-token' },
      loading: false,
      error: null,
    });
  });

  it('should clear user data and sign out on logout', async () => {
    // Arrange
    supabase.auth.signOut.mockResolvedValue({ error: null });

    // Act
    await useAuthStore.getState().logout();

    // Assert
    expect(supabase.auth.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
