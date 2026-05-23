import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(),
    }
  };
});

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, profile: null, session: null, loading: true, error: null });
  });

  it('should initialize with no user if session is empty', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().init();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should initialize with user and fetch profile', async () => {
    const mockUser = { id: 'user1', email: 'test@test.com' };
    const mockProfile = { id: 'user1', role: 'teacher' };

    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ select: selectMock });

    await useAuthStore.getState().init();

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should logout user correctly', async () => {
    supabase.auth.signOut.mockResolvedValue();
    useAuthStore.setState({ user: { id: '123' }, profile: { role: 'student' } });

    await useAuthStore.getState().logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().profile).toBeNull();
  });

  it('should handle fetchProfile failure and create a fallback profile', async () => {
     const mockUser = { id: 'user2', email: 'test2@test.com', user_metadata: { full_name: 'Test 2', role: 'student' } };
     const mockNewProfile = { id: 'user2', full_name: 'Test 2', display_name: 'Test 2', role: 'student' };

     supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
     supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

     // First call: not found
     const singleSelectMock = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
     const eqSelectMock = vi.fn().mockReturnValue({ single: singleSelectMock });
     const selectMock = vi.fn().mockReturnValue({ eq: eqSelectMock });

     // Second call: insert
     const singleInsertMock = vi.fn().mockResolvedValue({ data: mockNewProfile, error: null });
     const selectInsertMock = vi.fn().mockReturnValue({ single: singleInsertMock });
     const insertMock = vi.fn().mockReturnValue({ select: selectInsertMock });

     supabase.from.mockImplementation((table) => {
       if (table === 'profiles') {
         return {
           select: selectMock,
           insert: insertMock
         }
       }
     });

     await useAuthStore.getState().init();

     expect(useAuthStore.getState().user).toEqual(mockUser);
     expect(useAuthStore.getState().profile).toEqual(mockNewProfile);
  });
});
