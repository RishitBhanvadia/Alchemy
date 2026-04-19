import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../authStore';
import { supabase } from '../../supabaseClient';

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
            signOut: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(),
                })),
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(),
                })),
            })),
        })),
    },
}));

describe('authStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the store state before each test
        useAuthStore.setState({
            user: null,
            profile: null,
            session: null,
            loading: true,
            error: null,
        });
    });

    it('should have initial state', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.profile).toBeNull();
        expect(state.session).toBeNull();
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    describe('init', () => {
        it('should handle no active session', async () => {
            supabase.auth.getSession.mockResolvedValue({
                data: { session: null }
            });

            await useAuthStore.getState().init();

            const state = useAuthStore.getState();
            expect(state.loading).toBe(false);
            expect(state.user).toBeNull();
        });

        it('should fetch profile when session exists', async () => {
            const mockSession = { user: { id: 'user-123', email: 'test@example.com' } };
            const mockProfile = { id: 'user-123', full_name: 'Test User' };

            supabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession }
            });

            const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
            const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
            const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
            supabase.from.mockReturnValue({ select: mockSelect });

            await useAuthStore.getState().init();

            const state = useAuthStore.getState();
            expect(state.loading).toBe(false);
            expect(state.user).toEqual(mockSession.user);
            expect(state.profile).toEqual(mockProfile);
            expect(state.session).toEqual(mockSession);
        });

        it('should handle getSession error', async () => {
            supabase.auth.getSession.mockRejectedValue(new Error('Auth failed'));

            await useAuthStore.getState().init();

            const state = useAuthStore.getState();
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Auth failed');
        });
    });

    describe('logout', () => {
        it('should clear state on logout', async () => {
            useAuthStore.setState({
                user: { id: '123' },
                profile: { name: 'test' },
                session: { token: 'abc' },
                loading: false,
            });

            supabase.auth.signOut.mockResolvedValue({ error: null });

            await useAuthStore.getState().logout();

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.profile).toBeNull();
            expect(state.session).toBeNull();
            expect(state.loading).toBe(false);
            expect(supabase.auth.signOut).toHaveBeenCalled();
        });
    });
});
