import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        expect(screen.getByRole('link', { name: /laboratory/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /titration/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^organic/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /inorganic/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
    });

    it('should have correct navigation links', () => {
        renderDashboard();
        expect(screen.getByRole('link', { name: /laboratory/i })).toHaveAttribute('href', '/lab');
        expect(screen.getByRole('link', { name: /titration/i })).toHaveAttribute('href', '/titration');
        expect(screen.getByRole('link', { name: /^organic/i })).toHaveAttribute('href', '/organic');
        expect(screen.getByRole('link', { name: /inorganic/i })).toHaveAttribute('href', '/inorganic');
        expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute('href', '/history');
    });
});
