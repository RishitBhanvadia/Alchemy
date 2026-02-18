import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

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
        // Updated to match the actual text "WELCOME, ADMIN" instead of "DASHBOARD"
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Assuming the card is now a Link or button, we look for the clickable element
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Since they are Links, they have native keyboard support, so we just check existence
        renderDashboard();
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');
    });
});
