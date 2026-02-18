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
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();

        // History is in dropdown, so we need to hover over "MORE"
        const moreLink = screen.getByText(/more/i);
        fireEvent.mouseEnter(moreLink);

        expect(screen.getByText(/history/i)).toBeInTheDocument();
    });

    it('should have correct navigation structure', () => {
        const { container } = renderNavbar();
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });
});
