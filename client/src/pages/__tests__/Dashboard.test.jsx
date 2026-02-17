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
        // Use getAllByText for elements that might appear multiple times or use specific selectors
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        expect(screen.getByText(/titration/i)).toBeInTheDocument();

        // "ORGANIC" might appear in "ORGANIC" and "INORGANIC", so regex /organic/i matches both.
        // We use a more specific regex or getAll
        const organicElements = screen.getAllByText(/^organic$/i);
        expect(organicElements.length).toBeGreaterThan(0);
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labLink = screen.getByText(/laboratory/i).closest('a');
        expect(labLink).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labLink = screen.getByText(/laboratory/i).closest('a');
        expect(labLink).toBeInTheDocument();
        labLink.focus();
        expect(document.activeElement).toBe(labLink);
    });
});
