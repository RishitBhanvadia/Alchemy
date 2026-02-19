import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
    const renderNavbar = () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
    };

    it('should render navigation links', () => {
        renderNavbar();
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
        // The dropdown trigger is "MORE", and actual items (history, etc.) are in the dropdown
        // We can test if "MORE" exists
        expect(screen.getByText(/more/i)).toBeInTheDocument();
    });

    it('should have correct navigation structure', () => {
        renderNavbar();
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
    });

    it('should render profile icon', () => {
        renderNavbar();
        expect(screen.getByText('ADM')).toBeInTheDocument();
    });
});
