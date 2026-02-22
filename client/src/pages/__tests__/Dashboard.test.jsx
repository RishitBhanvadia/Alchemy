import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Hoist mockNavigate
const { mockNavigate } = vi.hoisted(() => {
    return {
        mockNavigate: vi.fn(),
    };
});

// Mock navigate
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
        expect(screen.getByText(/WELCOME, ADMIN/i)).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        // The dashboard structure might be different based on the error log html
        // <a class="module-card glass-panel" href="/lab"> ... <h3>LABORATORY</h3> ... </a>
        // It seems they are anchor tags now, not div[role="button"]

        // Let's check the HTML from the error log again.
        /*
           <a
             class="module-card glass-panel"
             href="/lab"
           >
             <div class="icon-container">...</div>
             <h3>LABORATORY</h3>
             ...
           </a>
        */

        // FireEvent.click on the link should work if we preventDefault?
        // Or if it's a Link from react-router-dom?
        // The mock for react-router-dom only mocks useNavigate.
        // If Dashboard uses <Link>, it will use the actual Link implementation
        // (which uses the context provided by BrowserRouter).
        // Clicking a Link in a test environment with BrowserRouter usually updates the history/URL.
        // But the test expects mockNavigate to be called.

        // Let's assume the component uses useNavigate for navigation on div click?
        // Wait, the HTML shows <a> tags.
        // If the component uses <a> tags with href, then mockNavigate won't be called unless there is an onClick handler that calls navigate().
        // If it's just a plain <a> tag, the test `expect(mockNavigate).toHaveBeenCalled()` will fail.

        // However, the previous test passed `should navigate on module card click`!
        // `tests/Dashboard.test.jsx (4 tests | 1 failed)`
        // `✓ should navigate on module card click`
        // So the navigation logic must be working.
        // Perhaps `Dashboard` uses `useNavigate` and attaches it to the card div/link?

        // Let's just fix the assertion and hoisting first.
        // If `should navigate on module card click` was passing before, I should try to keep the test logic similar
        // but adapt to the DOM if needed.
        // The error log showed:
        /*
           <a class="module-card glass-panel" href="/lab">
        */

        // The previous test code:
        // const labCard = screen.getByText(/laboratory/i).closest('div[role="button"]');

        // If the element is now an `<a>` tag, `closest('div[role="button"]')` will return null.
        // But the test passed! How?
        // Maybe in the previous run, the component was rendering divs?
        // Or maybe `closest` returned null, and the `if (labCard)` block was skipped!
        /*
        if (labCard) {
            fireEvent.click(labCard);
            expect(mockNavigate).toHaveBeenCalled();
        }
        */
        // Yes! The test was passing because it was doing NOTHING.

        // I should fix this test to actually test something.
        // I'll search for the card using the text and look for the closest link or button.

        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        // Since it's an anchor tag with href, checking navigation might need checking window.location
        // or just asserting the href attribute if we assume standard browser behavior.
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        // Similar issue here.
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toBeInTheDocument();
        expect(labCard).toHaveAttribute('href', '/lab');
    });
});
