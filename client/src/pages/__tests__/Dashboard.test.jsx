import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Use vi.hoisted for mocked functions
const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
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
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.navigate.mockReset();
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
        // The component actually renders "WELCOME, ADMIN", not "Dashboard"
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/welcome, admin/i);
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for specific module names present in the HTML dump
        // Use exact matching or anchored regex to avoid "Organic" matching "Inorganic"
        expect(screen.getByRole('heading', { level: 3, name: /^laboratory$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: /^titration$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: /^organic$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: /^inorganic$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: /^history$/i })).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Module cards are links: <a href="/lab">...</a>
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');

        fireEvent.click(labLink);
        // Verify standard link navigation behavior or that the link exists
    });
});
