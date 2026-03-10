import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock supabase
const mockSignOut = vi.fn();
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signOut: () => mockSignOut(),
        },
    },
}));

describe('Navbar Component', () => {
    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('should render navigation links', () => {
        renderNavbar();
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should render logout button', () => {
        renderNavbar();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('should have correct navigation structure', () => {
        const { container } = renderNavbar();
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('should handle dropdown interaction', () => {
        renderNavbar();

        // Initial state - dropdown hidden
        expect(screen.queryByText(/history/i)).not.toBeInTheDocument();

        const trigger = screen.getByText(/MORE/i);

        // Hover
        fireEvent.mouseEnter(trigger);
        expect(screen.getByText(/history/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^ORGANIC$/i })).toBeInTheDocument();

        // Leave
        fireEvent.mouseLeave(trigger);
        expect(screen.queryByText(/history/i)).not.toBeInTheDocument();

        // Keyboard navigation
        // Space
        fireEvent.keyPress(trigger, { key: ' ', code: 'Space', charCode: 32 });
        expect(screen.getByText(/history/i)).toBeInTheDocument();

        // Enter
        fireEvent.keyPress(trigger, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(screen.queryByText(/history/i)).not.toBeInTheDocument(); // toggles it off
    });

    it('should handle logout', async () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = { href: 'http://localhost/', origin: 'http://localhost' };

        renderNavbar();

        const logoutButton = screen.getByText(/logout/i);
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
            expect(window.location.href).toBe('/');
        });

        window.location = originalLocation;
    });
});
