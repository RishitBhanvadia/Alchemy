import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../supabaseClient';
import useAuthStore from '../authStore';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock dynamically imported stores
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
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with no user if session is missing', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should initialize with an authenticated user and fetch profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    const mockProfile = { id: '123', role: 'student' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().session).toEqual(mockSession);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should clear states and call signout on logout', async () => {
    useAuthStore.setState({ user: { id: '123' }, profile: { role: 'student' }, session: { user: { id: '123' } }, loading: false, error: null });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('should refresh profile successfully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', role: 'teacher' };

    useAuthStore.setState({ user: mockUser });

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      })
    });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().refreshProfile();

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });
});
