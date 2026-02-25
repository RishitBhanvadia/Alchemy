import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock CanvasContainer to avoid Three.js context issues in test
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
    default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        to: vi.fn(),
        fromTo: vi.fn(),
        timeline: vi.fn(() => ({
            to: vi.fn(),
            fromTo: vi.fn(),
        })),
        context: vi.fn((cb) => {
            cb();
            return { revert: vi.fn() };
        }),
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

    it('should disable "INITIATE REACTION" button initially', () => {
        renderLab();
        const button = screen.getByRole('button', { name: /INITIATE REACTION/i });
        expect(button).toBeDisabled();
    });

    it('should show helper text when button is disabled', () => {
        renderLab();
        // This is expected to fail initially
        const helperText = screen.getByText(/Add at least two chemicals to initiate reaction/i);
        expect(helperText).toBeInTheDocument();
    });
});
