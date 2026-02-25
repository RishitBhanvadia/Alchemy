import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const mocks = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mocks.mockNavigate,
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
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Use getAllByText because multiple elements might contain the text (e.g. icon tooltip/aria or hidden text)
        // or just relax the expectation.
        expect(screen.getAllByText(/LABORATORY/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/TITRATION/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/ORGANIC/i)[0]).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // We look for the link that contains LABORATORY text.
        // screen.getByText finds the h3. Closest 'a' finds the link.
        const labText = screen.getAllByText(/LABORATORY/i)[0];
        const labCard = labText.closest('a');
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labText = screen.getAllByText(/LABORATORY/i)[0];
        const labCard = labText.closest('a');
        expect(labCard).toBeInTheDocument();
        labCard.focus();
        expect(document.activeElement).toBe(labCard);
    });
});
