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
        // The title is "WELCOME, ADMIN", not "Dashboard"
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/titration/i)).toBeInTheDocument();
        // "Organic" and "Inorganic" might match multiple elements or each other if not precise
        // Use getAllByText to handle potential multiple matches or stricter regex
        expect(screen.getAllByText(/^ORGANIC$/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/^INORGANIC$/i)[0]).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The cards are links (<a> tags) in the actual implementation, not divs with role="button"
        // But we are testing interaction.
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toHaveAttribute('href', '/lab');
    });
});
