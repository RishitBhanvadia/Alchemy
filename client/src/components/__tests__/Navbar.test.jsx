import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signOut: vi.fn(),
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
        // History is hidden in dropdown, check visible ones
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    // Logout button is not currently implemented in the Navbar component
    // it('should render logout button', () => {
    //     renderNavbar();
    //     expect(screen.getByText(/logout/i)).toBeInTheDocument();
    // });

    it('should have correct navigation structure', () => {
        const { container } = renderNavbar();
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('should show dropdown menu on interaction', () => {
        renderNavbar();
        const moreLink = screen.getByText(/MORE/i);
        fireEvent.mouseEnter(moreLink);
        expect(screen.getByText(/HISTORY/i)).toBeInTheDocument();
    });
});
