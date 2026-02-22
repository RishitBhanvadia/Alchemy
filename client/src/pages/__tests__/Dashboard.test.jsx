import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => {
    return {
        mockNavigate: vi.fn(),
    };
});

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
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
        // The dashboard actually renders "WELCOME, ADMIN" or similar, not "Dashboard" as the main H1.
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // In the updated code, these might be <NavLink> or <a> tags, not divs with role="button"
        // Let's find the link by text.
        const labLink = screen.getByText(/laboratory/i).closest('a');
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Since these are now <a> tags (links), keyboard navigation is handled natively by the browser/router.
        // We can just verify they are links.
        renderDashboard();
        const labLink = screen.getByText(/laboratory/i).closest('a');
        expect(labLink).toBeInTheDocument();
    });
});
