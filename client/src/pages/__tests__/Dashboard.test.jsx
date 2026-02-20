import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock supabase (not used in Dashboard directly but maybe by Navbar if it was included, but Dashboard doesn't include Navbar)
// Actually Dashboard.jsx imports nothing but Link and CSS.
// So mocking supabase is not strictly needed unless a child uses it.
// But let's keep the mock structure clean.

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
        expect(screen.getByRole('link', { name: /laboratory/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /titration/i })).toBeInTheDocument();
        // Use stricter regex to avoid matching "inorganic" when searching for "organic"
        expect(screen.getByRole('link', { name: /^organic/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^inorganic/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
    });

    it('should have correct links', () => {
        renderDashboard();
        expect(screen.getByRole('link', { name: /laboratory/i })).toHaveAttribute('href', '/lab');
        expect(screen.getByRole('link', { name: /titration/i })).toHaveAttribute('href', '/titration');
    });
});
