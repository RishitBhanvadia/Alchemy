import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import React from 'react';

// Use vi.hoisted for mocks to avoid hoisting issues
const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    getUser: vi.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
    }),
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
            getUser: mocks.getUser,
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
        // The dashboard title is "WELCOME, ADMIN" based on Dashboard.jsx code
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();

        // Use getAllByRole to handle potential duplicates (e.g. from navbar)
        // Or better, verify there is at least one link for each module
        const labLinks = screen.getAllByRole('link', { name: /laboratory/i });
        expect(labLinks.length).toBeGreaterThan(0);

        const titrationLinks = screen.getAllByRole('link', { name: /titration/i });
        expect(titrationLinks.length).toBeGreaterThan(0);

        const organicLinks = screen.getAllByRole('link', { name: /organic/i });
        expect(organicLinks.length).toBeGreaterThan(0);

        const inorganicLinks = screen.getAllByRole('link', { name: /inorganic/i });
        expect(inorganicLinks.length).toBeGreaterThan(0);

        const historyLinks = screen.getAllByRole('link', { name: /history/i });
        expect(historyLinks.length).toBeGreaterThan(0);
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // Get the specific card link, assuming the first one or finding by specific container if needed
        // Assuming the module cards are unique enough or we just check the first one
        const labLink = screen.getAllByRole('link', { name: /laboratory/i })[0];
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labLink = screen.getAllByRole('link', { name: /laboratory/i })[0];
        labLink.focus();
        expect(labLink).toHaveFocus();
    });
});
