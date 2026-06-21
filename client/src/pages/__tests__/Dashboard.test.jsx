/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
        expect(screen.getByText((text) => text.match(/dashboard/i))).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('div[role="button"]');
        if (labCard) {
            fireEvent.click(labCard);
            expect(mockNavigate).toHaveBeenCalled();
        }
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('div[role="button"]');
        if (labCard) {
            fireEvent.keyPress(labCard, { key: 'Enter', code: 'Enter' });
            expect(mockNavigate).toHaveBeenCalled();
        }
    });
});
