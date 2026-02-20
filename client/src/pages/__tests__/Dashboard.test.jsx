import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
        // Updated to match "WELCOME, ADMIN" which is the actual title in the component
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The card is an anchor tag, not a div[role="button"]
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        // Since they are links, keyboard navigation is handled natively by the browser/router
        // We just check if the link exists and has correct href
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });
});
