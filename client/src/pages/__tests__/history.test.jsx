import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock Navbar to avoid rendering it
vi.mock('../../components/Navbar', () => ({
    default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockFrom = vi.fn();

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: (...args) => mockGetUser(...args),
        },
        from: (...args) => mockFrom(...args),
    },
}));

describe('History Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user123' } },
        });

        mockFrom.mockReturnValue({
            select: mockSelect.mockReturnValue({
                eq: mockEq.mockReturnValue({
                    order: mockOrder.mockResolvedValue({
                        data: [],
                        error: null,
                    }),
                }),
            }),
        });
    });

    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    it('should render the loading state initially', () => {
        renderHistory();
        expect(screen.getByText(/LOADING ARCHIVES/i)).toBeInTheDocument();
    });

    it('should handle empty experiments state', async () => {
        renderHistory();

        await waitFor(() => {
            expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
        });
    });

    it('should render experiment history data', async () => {
        mockOrder.mockResolvedValue({
            data: [
                {
                    id: 1,
                    created_at: '2023-01-01T12:00:00Z',
                    experiment_type: 'Titration',
                    score: 95,
                    details: { acid: 'HCl', base: 'NaOH' },
                },
                {
                    id: 2,
                    created_at: '2023-01-02T15:30:00Z',
                    experiment_type: 'Lab',
                    score: 60,
                    details: null,
                }
            ],
            error: null,
        });

        renderHistory();

        await waitFor(() => {
            // Check headers
            expect(screen.getByText('Date & Time')).toBeInTheDocument();
            expect(screen.getByText('Type')).toBeInTheDocument();
            expect(screen.getByText('Score')).toBeInTheDocument();
            expect(screen.getByText('Details')).toBeInTheDocument();

            // Check data rows
            expect(screen.getByText('Titration')).toBeInTheDocument();
            expect(screen.getByText('95/100')).toBeInTheDocument();
            expect(screen.getByText('acid:')).toBeInTheDocument();
            expect(screen.getByText('HCl')).toBeInTheDocument();

            expect(screen.getByText('Lab')).toBeInTheDocument();
            expect(screen.getByText('60/100')).toBeInTheDocument();
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });
    });

    it('should handle errors when fetching data', async () => {
        mockOrder.mockRejectedValue(new Error('Failed to fetch'));
        const { default: logger } = await import('../../utils/logger');

        renderHistory();

        await waitFor(() => {
            expect(logger.error).toHaveBeenCalledWith('Error fetching history:', expect.any(Error));
        });

        // Still should show empty state when failing
        expect(screen.getByText(/No experiments recorded yet/i)).toBeInTheDocument();
    });
});
