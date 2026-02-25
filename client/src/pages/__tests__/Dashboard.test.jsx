import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mocks.navigate,
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
        expect(screen.getByText(/select a module to begin experimentation/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names using stricter regex to avoid substring matches (e.g., ORGANIC vs INORGANIC)
        expect(screen.getByText(/^laboratory$/i)).toBeInTheDocument();
        expect(screen.getByText(/^titration$/i)).toBeInTheDocument();
        expect(screen.getByText(/^organic$/i)).toBeInTheDocument();
        expect(screen.getByText(/^inorganic$/i)).toBeInTheDocument();
        expect(screen.getByText(/^history$/i)).toBeInTheDocument();
    });

    it('should have correct links on module cards', () => {
        renderDashboard();
        const labCard = screen.getByText(/^laboratory$/i).closest('a');
        expect(labCard).toHaveAttribute('href', '/lab');

        const titrationCard = screen.getByText(/^titration$/i).closest('a');
        expect(titrationCard).toHaveAttribute('href', '/titration');
    });
});
