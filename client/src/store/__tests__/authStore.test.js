import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
            signOut: vi.fn()
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn()
                }))
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn()
                }))
            }))
        }))
    }
}));

describe('authStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset zustand state
        useAuthStore.setState({
            user: null,
            profile: null,
            session: null,
            loading: true,
            error: null
        });
    });

    describe('init', () => {
        it('should handle unauthenticated session', async () => {
            supabase.auth.getSession.mockResolvedValue({
                data: { session: null }
            });

            await useAuthStore.getState().init();

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.profile).toBeNull();
            expect(state.session).toBeNull();
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('should handle authenticated session and fetch profile', async () => {
            const mockUser = { id: 'user-123', email: 'test@example.com' };
            const mockSession = { user: mockUser };
            const mockProfile = { id: 'user-123', role: 'student' };

            supabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession }
            });

            // Mock profile fetch
            const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
            const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
            const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
            supabase.from.mockReturnValue({ select: mockSelect });

            await useAuthStore.getState().init();

            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.profile).toEqual(mockProfile);
            expect(state.session).toEqual(mockSession);
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('should auto-create profile if PGRST116 error occurs', async () => {
            const mockUser = { id: 'user-123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } };
            const mockSession = { user: mockUser };
            const newProfile = { id: 'user-123', full_name: 'Test User', role: 'student' };

            supabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession }
            });

            // Mock profile fetch returning PGRST116
            const mockSelectSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
            const mockEq = vi.fn().mockReturnValue({ single: mockSelectSingle });
            const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

            // Mock profile creation
            const mockInsertSingle = vi.fn().mockResolvedValue({ data: newProfile, error: null });
            const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
            const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

            supabase.from.mockImplementation((table) => {
                if (table === 'profiles') {
                    return {
                        select: mockSelect,
                        insert: mockInsert
                    };
                }
            });

            await useAuthStore.getState().init();

            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                id: 'user-123',
                full_name: 'Test User'
            }));

            const state = useAuthStore.getState();
            expect(state.profile).toEqual(newProfile);
        });
    });

    describe('logout', () => {
        it('should clear state and call signOut', async () => {
            useAuthStore.setState({
                user: { id: '123' },
                profile: { role: 'student' },
                session: { token: 'abc' },
                loading: false,
                error: 'some error'
            });

            supabase.auth.signOut.mockResolvedValue();

            await useAuthStore.getState().logout();

            const state = useAuthStore.getState();
            expect(supabase.auth.signOut).toHaveBeenCalled();
            expect(state.user).toBeNull();
            expect(state.profile).toBeNull();
            expect(state.session).toBeNull();
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });
    });
});
