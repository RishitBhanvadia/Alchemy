import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Hoist mocks to avoid ReferenceError
const { mockGetUser, mockFrom, mockOrder } = vi.hoisted(() => {
    const mockOrder = vi.fn();
    const mockEq = vi.fn(() => ({ order: mockOrder }));
    const mockSelect = vi.fn(() => ({ eq: mockEq }));
    const mockFrom = vi.fn(() => ({ select: mockSelect }));
    const mockGetUser = vi.fn();
    return { mockGetUser, mockFrom, mockSelect, mockEq, mockOrder };
});

// Mock dependencies
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: mockGetUser,
        },
        from: mockFrom,
    },
}));

vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock assets
vi.mock('../assets/logo.png', () => ({
    default: 'logo.png',
}));

describe('History Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    it('should show loading state initially', () => {
        // Setup a pending promise to keep it in loading state
        mockGetUser.mockReturnValue(new Promise(() => {}));
        renderHistory();
        expect(screen.getByText(/LOADING ARCHIVES/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
    });

    it('should render empty state when no experiments found', async () => {
        // Mock user found
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null
        });

        // Mock empty experiments
        mockOrder.mockResolvedValue({
            data: [],
            error: null
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.queryByText(/LOADING ARCHIVES/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
    });

    it('should render experiments list when data exists', async () => {
        const mockExperiments = [
            {
                id: '1',
                created_at: '2023-10-27T10:00:00Z',
                experiment_type: 'Titration',
                score: 95,
                details: { acid: 'HCl', base: 'NaOH' }
            },
            {
                id: '2',
                created_at: '2023-10-26T14:30:00Z',
                experiment_type: 'Lab',
                score: 80,
                details: { result: 'Success' }
            }
        ];

        mockGetUser.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null
        });

        mockOrder.mockResolvedValue({
            data: mockExperiments,
            error: null
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.getByText('Titration')).toBeInTheDocument();
        });

        expect(screen.getByText('Lab')).toBeInTheDocument();
        expect(screen.getByText('95/100')).toBeInTheDocument();
        expect(screen.getByText('80/100')).toBeInTheDocument();

        // Check formatted date
        // Note: Date formatting depends on locale, checking for parts
        expect(screen.getAllByText(/Oct/).length).toBeGreaterThan(0);
    });

    it('should handle error fetching user', async () => {
         mockGetUser.mockResolvedValue({
            data: { user: null },
            error: { message: 'Auth error' }
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.queryByText(/LOADING ARCHIVES/i)).not.toBeInTheDocument();
        });

        // If user is null, it just stops loading and shows empty state (based on code logic: setExperiments is initialized to [])
        // The catch block logs error but finally sets loading false.
        expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
    });
});
