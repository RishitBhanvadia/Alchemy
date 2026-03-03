import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Mock Navbar to avoid rendering dependencies
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock Supabase
const { mockGetUser, mockSelect, mockEq, mockOrder } = vi.hoisted(() => {
    return {
        mockGetUser: vi.fn(),
        mockSelect: vi.fn(),
        mockEq: vi.fn(),
        mockOrder: vi.fn(),
    };
});

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: mockGetUser,
        },
        from: vi.fn(() => ({
            select: mockSelect.mockReturnThis(),
            eq: mockEq.mockReturnThis(),
            order: mockOrder,
        })),
    },
}));

describe('History Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default success setup: User exists, returning query chain
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-123' } },
        });

        mockSelect.mockReturnValue({
            eq: mockEq,
        });

        mockEq.mockReturnValue({
            order: mockOrder,
        });
    });

    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    it('should show loading state initially', async () => {
        // Prevent immediate resolution to check loading state
        mockOrder.mockImplementation(() => new Promise(() => {}));

        renderHistory();

        expect(screen.getByText(/LOADING ARCHIVES.../i)).toBeInTheDocument();
    });

    it('should display empty state when no experiments found', async () => {
        mockOrder.mockResolvedValue({
            data: [],
            error: null,
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
        });
    });

    it('should render history records correctly', async () => {
        const mockData = [
            {
                id: 1,
                created_at: '2023-10-01T12:00:00Z',
                experiment_type: 'Titration',
                score: 95,
                details: { volume: '25ml', concentration: '0.1M' }
            },
            {
                id: 2,
                created_at: '2023-10-02T14:30:00Z',
                experiment_type: 'Organic Synthesis',
                score: 65,
                details: null
            }
        ];

        mockOrder.mockResolvedValue({
            data: mockData,
            error: null,
        });

        renderHistory();

        // Wait for loading to finish and table headers to appear
        await waitFor(() => {
            expect(screen.getByText(/Titration/i)).toBeInTheDocument();
        });

        // Verify scores
        expect(screen.getByText('95/100')).toBeInTheDocument();
        expect(screen.getByText('65/100')).toBeInTheDocument();

        // Verify type rendering
        expect(screen.getByText('Organic Synthesis')).toBeInTheDocument();

        // Verify details object rendering
        expect(screen.getByText(/volume:/i)).toBeInTheDocument();
        expect(screen.getByText('25ml')).toBeInTheDocument();
    });

    it('should handle error from Supabase and still remove loading state', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockOrder.mockResolvedValue({
            data: null,
            error: new Error('Database connection failed'),
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
        });

        // Logger should have been called
        const logger = (await import('../../utils/logger')).default;
        expect(logger.error).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
