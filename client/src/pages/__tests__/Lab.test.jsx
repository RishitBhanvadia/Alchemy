import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => {
    return { mockNavigate: vi.fn() };
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock CanvasContainer to avoid Three.js issues
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
    default: () => <div data-testid="canvas-container"></div>,
}));

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        context: () => ({ revert: vi.fn() }),
        fromTo: vi.fn(),
    },
}));

describe('Lab Component', () => {
    const renderLab = () => {
        return render(
            <BrowserRouter>
                <Lab />
            </BrowserRouter>
        );
    };

    it('should render lab interface', () => {
        renderLab();
        expect(screen.getByText(/chemical rack/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /initiate reaction/i })).toBeInTheDocument();
    });

    it('should have disabled initiate button initially', () => {
        renderLab();
        const button = screen.getByRole('button', { name: /initiate reaction/i });
        expect(button).toBeDisabled();
    });

    it('should show helper text when button is disabled', () => {
        renderLab();
        // This is expected to FAIL initially
        expect(screen.getByText(/add at least two chemicals/i)).toBeInTheDocument();
    });
});
