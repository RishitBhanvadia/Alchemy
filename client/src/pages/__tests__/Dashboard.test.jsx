import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
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
        expect(screen.getByText(/titration/i)).toBeInTheDocument();
        // The word "Organic" appears in both "Organic" and "Inorganic" modules
        // So we need to be more specific for "Organic" to distinguish it from "Inorganic"
        expect(screen.getAllByText(/organic/i)).toHaveLength(2); // Matches "Organic" and "Inorganic"
        expect(screen.getByText(/^ORGANIC$/i)).toBeInTheDocument(); // Exact match for Organic module
        expect(screen.getByText(/inorganic/i)).toBeInTheDocument();
        expect(screen.getByText(/history/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Since Link components are anchor tags, they are natively keyboard accessible.
        // We can just verify they are links.
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        // Focus check (optional but good for a11y)
        labCard.focus();
        expect(labCard).toHaveFocus();
    });
});
