import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

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
        // The accessible name of the link includes all text content (Header + Paragraph)
        // We use regex to match the START of the string to disambiguate "Organic" from "Inorganic"
        expect(screen.getByRole('link', { name: /laboratory/i })).toHaveAttribute('href', '/lab');
        expect(screen.getByRole('link', { name: /titration/i })).toHaveAttribute('href', '/titration');

        // Match links starting with "Organic" (ignoring case)
        expect(screen.getByRole('link', { name: /^organic/i })).toHaveAttribute('href', '/organic');
        // Match links starting with "Inorganic" (ignoring case)
        expect(screen.getByRole('link', { name: /^inorganic/i })).toHaveAttribute('href', '/inorganic');

        expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute('href', '/history');
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
        expect(labLink).toHaveAttribute('href', '/lab');
    });
});
