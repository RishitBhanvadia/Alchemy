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
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id', email: 'test@example.com' } },
            }),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    order: vi.fn().mockResolvedValue({
                        data: [], // Empty array for no experiments
                        error: null,
                    }),
                })),
            })),
        })),
    },
}));

// Mock Navbar to simplify testing (avoid nested routing/state issues)
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar-mock">Navbar</div>
}));

// Mock logger to avoid console spam
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    }
}));

describe('History Component - Empty State', () => {
    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the empty state when no experiments exist', async () => {
        renderHistory();

        // Wait for loading to finish (mocked data returns immediately but useEffect is async)
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        // Check for new empty state text
        // Note: This test expects the NEW UI. It will fail if run against current code.
        expect(screen.getByText(/no experiments found/i)).toBeInTheDocument();
        expect(screen.getByText(/your scientific journey begins in the laboratory/i)).toBeInTheDocument();

        // Check for the button
        const button = screen.getByRole('button', { name: /enter laboratory/i });
        expect(button).toBeInTheDocument();

        // Test navigation
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/lab');
    });
});
