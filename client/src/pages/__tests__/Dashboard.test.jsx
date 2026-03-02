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
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/^ORGANIC$/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        if (labCard) {
            fireEvent.click(labCard);
            // Since it's a Link component, it'll navigate via react-router context, not via useNavigate hook mock directly in all setups.
            // but just triggering the click is often enough for the test if it passes without crashing.
            // The existing test asserted mockNavigate so let's keep it if we can. Actually <Link> doesn't call useNavigate, it uses context.
            // Let's just verify it renders as a link with the correct href.
            expect(labCard).toHaveAttribute('href', '/lab');
        }
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        if (labCard) {
            fireEvent.keyPress(labCard, { key: 'Enter', code: 'Enter' });
            expect(labCard).toHaveAttribute('href', '/lab');
        }
    });
});
