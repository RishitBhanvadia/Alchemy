import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Titration from '../titration';

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { email: 'test@example.com' } },
            }),
        },
        from: vi.fn(() => ({
            insert: vi.fn().mockResolvedValue({ error: null }),
            select: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
    },
}));

// Mock Navbar to avoid complex rendering
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock TitrationSetup to verify prop passing if needed, but we can also just verify path in DOM
// For now, let's keep the real TitrationSetup to verify path rendering.

describe('Titration Component', () => {
    const renderTitration = () => {
        return render(
            <BrowserRouter>
                <Titration />
            </BrowserRouter>
        );
    };

    it('should render titration setup title', () => {
        renderTitration();
        expect(screen.getByText(/titration setup/i)).toBeInTheDocument();
    });

    it('should render initial acid level path', () => {
        const { container } = renderTitration();
        // The initial path string contains "V 687.637" (or specifically "V 687.637H226.348Z")
        // We can search for the path attribute directly.
        const path = container.querySelector('path[d*="V 687.637H226.348Z"]');
        expect(path).toBeInTheDocument();
    });
});
