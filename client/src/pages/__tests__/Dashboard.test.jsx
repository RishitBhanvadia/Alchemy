import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

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
                data: { user: { email: 'test@example.com' } },
            }),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockResolvedValue({
                data: [],
                error: null,
            }),
        })),
    },
}));

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    it('should render dashboard title', () => {
        renderDashboard();
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Use exact matching to avoid "ORGANIC" matching "INORGANIC"
        expect(screen.getByText(/^laboratory$/i)).toBeInTheDocument();
        expect(screen.getByText(/^titration$/i)).toBeInTheDocument();
        expect(screen.getByText(/^organic$/i)).toBeInTheDocument();
        expect(screen.getByText(/^inorganic$/i)).toBeInTheDocument();
        expect(screen.getByText(/^history$/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Find the link wrapping the "LABORATORY" text
        // The accessible name of the link includes both the h3 (LABORATORY) and p (description) text.
        // So strict name matching might be tricky if description changes.
        // We can find by text and traverse up, or use a partial match on the name.

        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');
    });
});
