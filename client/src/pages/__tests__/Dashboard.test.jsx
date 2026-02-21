import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock dependencies
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
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
        // The actual title is "WELCOME, ADMIN"
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/titration/i)).toBeInTheDocument();
        expect(screen.getByText(/^organic/i)).toBeInTheDocument(); // Regex anchor to avoid ambiguity
        expect(screen.getByText(/inorganic/i)).toBeInTheDocument();
        expect(screen.getByText(/history/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Dashboard uses <Link> components, not click handlers on divs
        // We verify the href attribute exists
        const labLink = screen.getByText(/laboratory/i).closest('a');
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have correct links for modules', () => {
        renderDashboard();
        expect(screen.getByText(/titration/i).closest('a')).toHaveAttribute('href', '/titration');
        expect(screen.getByText(/^organic/i).closest('a')).toHaveAttribute('href', '/organic');
        expect(screen.getByText(/inorganic/i).closest('a')).toHaveAttribute('href', '/inorganic');
        expect(screen.getByText(/history/i).closest('a')).toHaveAttribute('href', '/history');
    });
});
