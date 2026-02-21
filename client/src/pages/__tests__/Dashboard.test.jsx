import { describe, it, expect, vi } from 'vitest';
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
    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    it('should render dashboard title', () => {
        renderDashboard();
        // The title is "WELCOME, ADMIN", not "Dashboard"
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/titration/i)).toBeInTheDocument();
        // Use regex start anchor to distinguish 'organic' from 'inorganic'
        expect(screen.getByText(/^organic/i)).toBeInTheDocument();
        expect(screen.getByText(/inorganic/i)).toBeInTheDocument();
        expect(screen.getByText(/history/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The modules are links now (<a>), not divs with role="button"
        // Based on the error output: <a class="module-card glass-panel" href="/lab">
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Since they are links, browser handles keyboard nav natively.
        // We can check if they are focusable or have valid hrefs.
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        // Focus test
        labCard.focus();
        expect(document.activeElement).toBe(labCard);
    });
});
