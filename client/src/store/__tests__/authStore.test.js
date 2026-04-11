import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  const singleMock = vi.fn();
  const selectMock = vi.fn().mockReturnThis();
  const eqMock = vi.fn().mockReturnThis();
  const insertMock = vi.fn().mockReturnThis();

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn()
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: singleMock
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: singleMock
          })
        })
      })
    }
  };
});

vi.mock('../labStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../historyStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../profileStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));
vi.mock('../classroomStore', () => ({
  default: { getState: () => ({ reset: vi.fn() }) }
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: null
    });
  });

  it('should initialize with no user if session is absent', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should initialize and fetch profile if session exists', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockProfile = { id: 'user-123', role: 'student', full_name: 'Test User' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockResolvedValue({ data: mockProfile, error: null });

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should handle onAuthStateChange correctly for SIGNED_OUT', async () => {
    let changeHandler = null;
    supabase.auth.onAuthStateChange.mockImplementation((handler) => {
      changeHandler = handler;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    useAuthStore.setState({
      user: { id: 'user-123' },
      profile: { id: 'user-123', full_name: 'Test User' },
      session: { user: { id: 'user-123' } },
      loading: false
    });

    delete window.location;
    window.location = { href: '' };

    const store = useAuthStore.getState();
    await store.init();

    expect(changeHandler).toBeTruthy();

    await changeHandler('SIGNED_OUT', null);

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('should handle fetchProfile fallback behavior if profile not found', async () => {
    const mockUser = { id: 'user-456', user_metadata: { full_name: 'New User' } };
    const newProfile = { id: 'user-456', full_name: 'New User', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    const insertSingleMock = supabase.from().insert().select().single;

    singleMock.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    insertSingleMock.mockResolvedValueOnce({ data: newProfile, error: null });

    const store = useAuthStore.getState();
    await store.init();

    expect(insertSingleMock).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(newProfile);
  });

  it('should clear other stores on logout', async () => {
    useAuthStore.setState({
      user: { id: 'user-123' },
      profile: { id: 'user-123', full_name: 'Test User' },
      session: { user: { id: 'user-123' } },
      loading: false
    });

    const store = useAuthStore.getState();
    await store.logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('should handle refreshProfile', async () => {
    const mockUser = { id: 'user-123', user_metadata: { full_name: 'Test User' } };
    const mockProfile = { id: 'user-123', full_name: 'Refreshed User' };

    useAuthStore.setState({ user: mockUser });

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockResolvedValueOnce({ data: mockProfile, error: null });

    const store = useAuthStore.getState();
    await store.refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('should handle onAuthStateChange correctly for SIGNED_IN', async () => {
    let changeHandler = null;
    supabase.auth.onAuthStateChange.mockImplementation((handler) => {
      changeHandler = handler;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const store = useAuthStore.getState();
    await store.init();

    expect(changeHandler).toBeTruthy();

    const mockUser = { id: 'user-789' };
    const mockProfile = { id: 'user-789', role: 'teacher' };

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockResolvedValueOnce({ data: mockProfile, error: null });

    await changeHandler('SIGNED_IN', { user: mockUser });

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('should handle onAuthStateChange correctly for TOKEN_REFRESHED', async () => {
    let changeHandler = null;
    supabase.auth.onAuthStateChange.mockImplementation((handler) => {
      changeHandler = handler;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const store = useAuthStore.getState();
    await store.init();

    const mockUser = { id: 'user-999' };
    const mockProfile = { id: 'user-999', role: 'student' };

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockResolvedValueOnce({ data: mockProfile, error: null });

    await changeHandler('TOKEN_REFRESHED', { user: mockUser });

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it('should handle fetchProfile fallback error', async () => {
    const mockUser = { id: 'user-456', user_metadata: { full_name: 'New User' } };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    const insertSingleMock = supabase.from().insert().select().single;

    singleMock.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    insertSingleMock.mockResolvedValueOnce({ data: null, error: { code: 'ERR', message: 'failed' } });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = useAuthStore.getState();
    await store.init();

    expect(insertSingleMock).toHaveBeenCalled();
    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle fetchProfile regular error', async () => {
    const mockUser = { id: 'user-456' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockResolvedValueOnce({ data: null, error: { code: 'OTHER_ERR', message: 'failed' } });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle fetchProfile exception', async () => {
    const mockUser = { id: 'user-456' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    singleMock.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().profile).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should cover fetchProfile empty user metadata', async () => {
    const mockUser = { id: 'user-777', email: 'no_metadata@test.com' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

    const singleMock = supabase.from().select().eq().single;
    const insertSingleMock = supabase.from().insert().select().single;

    singleMock.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    insertSingleMock.mockResolvedValueOnce({ data: { id: 'user-777', full_name: 'no_metadata', role: 'student' }, error: null });

    const store = useAuthStore.getState();
    await store.init();

    expect(insertSingleMock).toHaveBeenCalled();
  });

  it('should handle init err', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('init err'));

    const store = useAuthStore.getState();
    await store.init();

    expect(useAuthStore.getState().error).toBe('init err');
  });

  it('should cover refreshProfile null user', async () => {
    useAuthStore.setState({ user: null, profile: null });

    const store = useAuthStore.getState();
    await store.refreshProfile();

    expect(useAuthStore.getState().profile).toBeNull();
  });
});
