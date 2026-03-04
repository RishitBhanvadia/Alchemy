import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../Dashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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
        expect(screen.getByText(/LABORATORY/i)).toBeInTheDocument();
        expect(screen.getByText(/TITRATION/i)).toBeInTheDocument();
        expect(screen.getByText(/^ORGANIC$/i)).toBeInTheDocument();
        expect(screen.getByText(/^INORGANIC$/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labCard = screen.getByText(/LABORATORY/i).closest('a');
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    it('should have keyboard navigation on cards', () => {
        renderDashboard();
        const cards = screen.getAllByRole('link');
        cards.forEach(card => {
            expect(card).toHaveAttribute('href');
        });
    });
});
