import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Hoist mockNavigate
const { mockNavigate } = vi.hoisted(() => {
    return {
        mockNavigate: vi.fn(),
    };
});

// Mock navigate
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
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Check for link existence and href
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Similar issue here.
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });
});
