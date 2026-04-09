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
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });
    await useAuthStore.getState().init();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should set user and fetch profile if session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student' };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual(mockProfile);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
  });

  it('should logout and clear state', async () => {
    useAuthStore.setState({ user: { id: '123' }, profile: {}, session: {} });
    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.session).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle PGRST116 (not found) and fallback to insert', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });

    const singleSelectMock = vi.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    const singleInsertMock = vi.fn().mockResolvedValueOnce({ data: { id: '123', full_name: 'test' }, error: null });

    supabase.from.mockImplementation(() => {
        return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleSelectMock,
            insert: vi.fn().mockImplementation(() => ({
                select: vi.fn().mockImplementation(() => ({
                    single: singleInsertMock
                }))
            }))
        }
    });

    await useAuthStore.getState().init();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.profile).toEqual({ id: '123', full_name: 'test' });
  });
});
