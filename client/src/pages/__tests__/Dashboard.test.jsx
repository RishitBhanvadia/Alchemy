import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
    // Helper component to verify navigation
    const LocationDisplay = () => {
        return <div data-testid="location-display">Current Route Rendered</div>;
    };

    const renderDashboard = () => {
        return render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/lab" element={<LocationDisplay />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should render dashboard title', () => {
        renderDashboard();
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        expect(screen.getByText('LABORATORY')).toBeInTheDocument();
        expect(screen.getByText('TITRATION')).toBeInTheDocument();
        expect(screen.getByText('ORGANIC')).toBeInTheDocument();
        expect(screen.getByText('INORGANIC')).toBeInTheDocument();
        expect(screen.getByText('HISTORY')).toBeInTheDocument();
    });

    it('should navigate on module card click', async () => {
        const user = userEvent.setup();
        renderDashboard();

        // Click the LABORATORY card
        const labCard = screen.getByText('LABORATORY').closest('a');
        await user.click(labCard);

        // Verify navigation occurred (LocationDisplay rendered)
        expect(screen.getByTestId('location-display')).toBeInTheDocument();
    });

    it('should have keyboard navigation on cards', async () => {
        const user = userEvent.setup();
        renderDashboard();

        // Press Tab to focus the first card (LABORATORY)
        await user.tab();
        const labCard = screen.getByText('LABORATORY').closest('a');
        expect(labCard).toHaveFocus();

        // Press Enter to activate
        await user.keyboard('{Enter}');
        expect(screen.getByTestId('location-display')).toBeInTheDocument();
    });
});
