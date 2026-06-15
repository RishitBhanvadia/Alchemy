import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  const singleMock = vi.fn();
  const eqMock = vi.fn(() => ({ single: singleMock }));
  const selectMock = vi.fn(() => ({ eq: eqMock, single: singleMock }));
  const insertMock = vi.fn(() => ({ select: selectMock, single: singleMock }));

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: selectMock,
        insert: insertMock,
      })),
    },
  };
});

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with session and fetch profile', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    // Mock the profile fetch chain
    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const eqMock = vi.fn(() => ({ single: singleMock }));
    const selectMock = vi.fn(() => ({ eq: eqMock }));
    supabase.from.mockReturnValue({ select: selectMock });

    const store = useAuthStore.getState();
    await store.init();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should handle missing session on init', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should handle logout', async () => {
    useAuthStore.setState({ user: { id: '1' }, profile: { id: '1' }, session: {} });
    supabase.auth.signOut.mockResolvedValue();

    const store = useAuthStore.getState();
    await store.logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
  });
});
