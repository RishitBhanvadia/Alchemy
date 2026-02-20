import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Result from '../result.jsx';

// Hoist Supabase mocks
const mocks = vi.hoisted(() => {
    const mockInsert = vi.fn();
    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockFrom = vi.fn();
    const mockGetUser = vi.fn();

    // Default behaviors
    mockFrom.mockReturnValue({
        select: mockSelect,
        insert: mockInsert
    });
    mockSelect.mockReturnValue({
        eq: mockEq
    });
    mockEq.mockReturnValue({
        data: [],
        error: null
    });
    mockInsert.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-id' } } });

    return {
        mockInsert,
        mockSelect,
        mockEq,
        mockFrom,
        mockGetUser
    };
});

// Use hoisted mocks
vi.mock('../../supabaseClient', () => ({
    supabase: {
        from: mocks.mockFrom,
        auth: {
            getUser: mocks.mockGetUser
        }
    }
}));

// Mock Assets
vi.mock('../assets/cloud.png', () => ({ default: 'cloud.png' }));
vi.mock('../assets/boom.gif', () => ({ default: 'boom.gif' }));
vi.mock('../assets/logo.png', () => ({ default: 'logo.png' }));

// Mock Components
vi.mock('../components/result_testtube', () => ({ default: () => <div data-testid="test-tube">Test Tube</div> }));
vi.mock('../components/banner', () => ({ default: () => <div data-testid="bubble-banner">Banner</div> }));

// Mock CSS
vi.mock('./result.css', () => ({}));

// Mock Logger
vi.mock('../utils/logger', () => ({
    default: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    }
}));

// Mock React Router
const routerMocks = vi.hoisted(() => {
    return {
        useLocation: vi.fn(),
        useNavigate: vi.fn(),
    };
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: routerMocks.useLocation,
        useNavigate: routerMocks.useNavigate,
    };
});

// Setup default mock implementation for router
routerMocks.useLocation.mockReturnValue({
    state: {
        chemA: 10,
        chemB: 0,
        chemC: 0,
        chemD: 0,
        experimentId: 'exp-123'
    }
});
routerMocks.useNavigate.mockReturnValue(vi.fn());

describe('Result Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        localStorage.clear();

        // Reset default mock behaviors
        mocks.mockFrom.mockReturnValue({
            select: mocks.mockSelect,
            insert: mocks.mockInsert
        });
        mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-id' } } });
        mocks.mockInsert.mockResolvedValue({ error: null });

        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{
                    product_name: 'Test Product',
                    result: 'Test Result',
                    color: '#ffffff',
                    solid_color: '#000',
                    gas_color: '#000',
                    gas: false,
                    solid: false,
                    product_properties: ['Prop1'],
                    product_uses: ['Use1']
                }]),
            })
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render loading state initially', async () => {
        // Mock fetch to simulate delay (promise that doesn't resolve immediately)
        let resolveFetch;
        const fetchPromise = new Promise(resolve => { resolveFetch = resolve; });
        global.fetch.mockReturnValue(fetchPromise);

        const { unmount } = render(<Result />);
        expect(screen.getByText(/ANALYZING REACTION/i)).toBeInTheDocument();

        // Cleanup
        resolveFetch({
             ok: true,
             json: () => Promise.resolve([])
        });
        unmount();
    });

    it('should fetch data and save result to Supabase', async () => {
        render(<Result />);

        // Wait for fetch and render
        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        // Verify Supabase insert
        await waitFor(() => {
            expect(mocks.mockFrom).toHaveBeenCalledWith('experiment_results');
            expect(mocks.mockInsert).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    user_id: 'test-user-id',
                    experiment_type: 'Reaction',
                    score: 100,
                    details: expect.objectContaining({
                        experimentId: 'exp-123',
                        product: 'Test Product'
                    })
                })
            ]));
        });
    });

    it('should not save duplicate result for same experimentId', async () => {
        // Pre-set session storage to simulate already saved
        sessionStorage.setItem('exp_saved_exp-123', 'true');

        render(<Result />);

        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        // Should NOT call insert
        expect(mocks.mockInsert).not.toHaveBeenCalled();
    });
});
