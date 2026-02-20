import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: '123', email: 'test@example.com' } },
            }),
        },
        from: vi.fn(() => ({
            select: mockSelect,
        })),
    },
}));

// Mock Navbar to avoid rendering complex child components
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>,
}));

describe('History Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup the chain for supabase query
        mockSelect.mockReturnValue({ eq: mockEq });
        mockEq.mockReturnValue({ order: mockOrder });
    });

    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    it('should render empty state when no experiments found', async () => {
        // Mock empty result
        mockOrder.mockResolvedValue({
            data: [],
            error: null,
        });

        renderHistory();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/loading archives/i)).not.toBeInTheDocument();
        });

        // Check for empty state text
        expect(screen.getByText(/no experiments found/i)).toBeInTheDocument();
        expect(screen.getByText(/your scientific journey begins/i)).toBeInTheDocument();

        // Check for start button
        const startButton = screen.getByRole('button', { name: /start experiment/i });
        expect(startButton).toBeInTheDocument();

        // Check navigation
        fireEvent.click(startButton);
        expect(mockNavigate).toHaveBeenCalledWith('/lab');
    });

    it('should render experiment list when data exists', async () => {
        const mockData = [
            {
                id: 1,
                created_at: '2023-01-01T12:00:00Z',
                experiment_type: 'Titration',
                score: 95,
                details: { volume: '10ml' }
            }
        ];

        mockOrder.mockResolvedValue({
            data: mockData,
            error: null,
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.getByText('Titration')).toBeInTheDocument();
            expect(screen.getByText('95/100')).toBeInTheDocument();
        });
    });
});
