import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

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

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
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
        // Use stricter regex or getByRole to differentiate ORGANIC vs INORGANIC
        expect(screen.getByRole('heading', { name: /^LABORATORY$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^TITRATION$/i })).toBeInTheDocument();
        // Use exact match to avoid matching INORGANIC
        expect(screen.getByRole('heading', { name: /^ORGANIC$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^INORGANIC$/i })).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labLink = screen.getByRole('link', { name: /LABORATORY/i });
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labLink = screen.getByRole('link', { name: /LABORATORY/i });
        expect(labLink.tagName).toBe('A');
    });
});
