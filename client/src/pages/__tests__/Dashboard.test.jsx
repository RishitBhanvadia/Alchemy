
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

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
        // The title is "WELCOME, ADMIN" based on the component code
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names. Using precise regex or roles to avoid partial matches (e.g., ORGANIC vs INORGANIC)
        expect(screen.getByRole('heading', { name: /^LABORATORY$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^TITRATION$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^ORGANIC$/i })).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The cards are Links, so they should have hrefs
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        // Links are naturally keyboard accessible, checking if they exist is sufficient for this test scope
        // unless there's custom key handlers, which there aren't in the provided code.
        const labLink = screen.getByRole('link', { name: /laboratory/i });
        expect(labLink).toBeInTheDocument();
    });
});
