import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../sidebar';

describe('Sidebar Component', () => {
    const renderSidebar = () => {
        return render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );
    };

    it('should have accessibility attributes on navigation buttons', () => {
        renderSidebar();

        // Lab
        const labBtn = screen.getByRole('button', { name: /^Laboratory$/i });
        expect(labBtn).toBeInTheDocument();
        expect(labBtn.querySelector('i')).toHaveAttribute('aria-hidden', 'true');

        // Titration
        const titrationBtn = screen.getByRole('button', { name: /^Titration$/i });
        expect(titrationBtn).toBeInTheDocument();
        expect(titrationBtn.querySelector('i')).toHaveAttribute('aria-hidden', 'true');

        // Organic
        const organicBtn = screen.getByRole('button', { name: /^Organic Chemistry$/i });
        expect(organicBtn).toBeInTheDocument();
        expect(organicBtn.querySelector('i')).toHaveAttribute('aria-hidden', 'true');

        // Inorganic
        const inorganicBtn = screen.getByRole('button', { name: /^Inorganic Chemistry$/i });
        expect(inorganicBtn).toBeInTheDocument();
        expect(inorganicBtn.querySelector('i')).toHaveAttribute('aria-hidden', 'true');

        // History
        const historyBtn = screen.getByRole('button', { name: /^History$/i });
        expect(historyBtn).toBeInTheDocument();
        expect(historyBtn.querySelector('i')).toHaveAttribute('aria-hidden', 'true');
    });
});