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
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('has initial default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('logout resets state and clears session', async () => {
    supabase.auth.signOut.mockResolvedValue({});

    useAuthStore.setState({
      user: { id: '123' },
      profile: { full_name: 'Test User' },
      session: { access_token: 'abc' },
      loading: false,
      error: null,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('init sets error if getSession fails', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Session error'));

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.error).toBe('Session error');
    expect(state.loading).toBe(false);
  });
});
