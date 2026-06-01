import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom/extend-expect';

describe('Navbar Component', () => {
    test('renders Navbar with logo and text', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(screen.getByAltText('Alchemistry')).toBeInTheDocument();
        expect(screen.getByText('ALCHEMISTRY')).toBeInTheDocument();
    });

    test('renders primary navigation links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        const dashboardLink = screen.getByText('DASHBOARD');
        const labLink = screen.getByText('LABORATORY');

        expect(dashboardLink).toBeInTheDocument();
        expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');

        expect(labLink).toBeInTheDocument();
        expect(labLink.closest('a')).toHaveAttribute('href', '/lab');
    });

    test('dropdown is closed by default', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(screen.queryByText('HISTORY')).not.toBeInTheDocument();
        expect(screen.queryByText('ORGANIC')).not.toBeInTheDocument();
        expect(screen.queryByText('INORGANIC')).not.toBeInTheDocument();
        expect(screen.queryByText('TITRATION')).not.toBeInTheDocument();
    });

    test('dropdown opens on mouse enter and closes on mouse leave', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const moreTrigger = screen.getByText(/MORE/i);

        // Mouse enter
        fireEvent.mouseEnter(moreTrigger);

        expect(screen.getByText('HISTORY')).toBeInTheDocument();
        expect(screen.getByText('ORGANIC')).toBeInTheDocument();
        expect(screen.getByText('INORGANIC')).toBeInTheDocument();
        expect(screen.getByText('TITRATION')).toBeInTheDocument();

        // Mouse leave
        fireEvent.mouseLeave(moreTrigger);

        expect(screen.queryByText('HISTORY')).not.toBeInTheDocument();
    });

    test('dropdown links have correct paths', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const moreTrigger = screen.getByText(/MORE/i);
        fireEvent.mouseEnter(moreTrigger);

        expect(screen.getByText('HISTORY').closest('a')).toHaveAttribute('href', '/history');
        expect(screen.getByText('ORGANIC').closest('a')).toHaveAttribute('href', '/organic');
        expect(screen.getByText('INORGANIC').closest('a')).toHaveAttribute('href', '/inorganic');
        expect(screen.getByText('TITRATION').closest('a')).toHaveAttribute('href', '/titration');
    });
});
