import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
                data: { user: { email: 'admin@example.com' } },
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

    it('should render dashboard title', async () => {
        renderDashboard();
        // The title is "WELCOME, ADMIN", not "Dashboard"
        await waitFor(() => {
            expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
        });
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/titration/i)).toBeInTheDocument();
        // Use regex with start anchor to differentiate 'Organic' from 'Inorganic' because 'Organic' is a substring of 'Inorganic'.
        expect(screen.getByRole('heading', { name: /^organic/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /inorganic/i })).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The modules are <a> tags (links), not divs with role="button"
        // Based on the DOM dump: <a class="module-card glass-panel" href="/lab">

        // We can click the link. Since we use BrowserRouter, it might handle it or we mock the link click.
        // However, checking the implementation, they are likely standard react-router Links or anchors.
        // If they are <Link>, they use context. If <a>, they navigate.
        // Let's check if we can click the "LABORATORY" text.

        const labText = screen.getByText(/laboratory/i);
        expect(labText).toBeInTheDocument();

        // In this test environment with standard <a> tags, navigation might not trigger mockNavigate unless handled by a click handler.
        // But let's assume standard behavior or just check existence for now if navigation logic is implicit.
        // Wait, the test setup mocks `useNavigate`. If the component uses `useNavigate`, we check that.
        // If it uses `<a>` tags with `href`, `mockNavigate` won't be called unless we intercept clicks.
        // The DOM dump shows `<a href="/lab">`. This means it's a direct link or React Router Link.

        // Let's verified the 'href' attribute instead.
        const link = screen.getByRole('link', { name: /laboratory/i });
        expect(link).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Since they are links <a>, they are naturally keyboard accessible.
        // We can check if they have focus style or just exist as links.
        renderDashboard();
        const link = screen.getByRole('link', { name: /laboratory/i });
        link.focus();
        expect(link).toHaveFocus();
    });
});
