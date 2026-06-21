/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuthStore - return undefined profile to show teacher view (default)
vi.mock('../store/authStore', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        profile: undefined,
        logout: vi.fn(),
    })),
}));

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signOut: vi.fn(),
        },
    },
}));

import Navbar from '../Navbar';

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('should render navigation links for teacher (default)', () => {
        renderNavbar();
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/analytics/i)).toBeInTheDocument();
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
});
