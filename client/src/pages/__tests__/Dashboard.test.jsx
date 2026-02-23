import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock supabase - Dashboard doesn't use it directly but other components might
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { email: 'test@example.com' } },
            }),
        },
    },
}));

describe('Dashboard Component', () => {
    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    it('should render dashboard title', () => {
        renderDashboard();
        // The title is "WELCOME, ADMIN"
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names using role="heading" to be specific
        // Use stricter regex for "organic" to avoid matching "inorganic"
        expect(screen.getByRole('heading', { name: /laboratory/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /titration/i })).toBeInTheDocument();
        // ^organic$ matches exactly "organic" (case-insensitive), avoiding partial match with "inorganic"
        expect(screen.getByRole('heading', { name: /^organic$/i })).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // In React Router <Link>, clicking it triggers navigation.
        // We can find the link by its text or href.
        // We use closest('a') on the heading to find the link wrapping it.
        const labLink = screen.getByRole('heading', { name: /laboratory/i }).closest('a');
        expect(labLink).toHaveAttribute('href', '/lab');
    });
});
