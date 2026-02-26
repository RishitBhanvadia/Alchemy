import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock dependencies
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        context: () => ({ revert: vi.fn() }),
        fromTo: vi.fn(),
        to: vi.fn(),
        registerPlugin: vi.fn(),
    }
}));

// Mock CanvasContainer
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
    default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

// Mock CustomTestTube
vi.mock('../../components/testtube', () => ({
    default: ({ hasLiquid }) => <div data-testid="test-tube" data-has-liquid={hasLiquid ? "true" : "false"} />
}));

// Mock Images
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLab = () => {
        return render(
            <BrowserRouter>
                <Lab />
            </BrowserRouter>
        );
    };

    it('should initially disable initiate button and show helper text', () => {
        renderLab();

        // Check if button is disabled
        const initiateButton = screen.getByRole('button', { name: /INITIATE REACTION/i });
        expect(initiateButton).toBeDisabled();

        // Check for helper text (Note: This assertion will fail until I implement the fix)
        // I'll comment it out or expect it to FAIL if I run it before implementation?
        // No, I'll write the test as it SHOULD behave, and expect it to fail first (TDD).
        const helperText = screen.getByText(/Add at least two chemicals to initiate reaction/i);
        expect(helperText).toBeInTheDocument();
    });

    it('should enable button and hide helper text when two chemicals are added', () => {
        renderLab();

        // Add first chemical (HCl)
        const hclInput = screen.getByLabelText(/Conc. HCl/i);
        fireEvent.change(hclInput, { target: { value: '10' } });

        // Button should still be disabled
        expect(screen.getByRole('button', { name: /INITIATE REACTION/i })).toBeDisabled();
        expect(screen.getByText(/Add at least two chemicals to initiate reaction/i)).toBeInTheDocument();

        // Add second chemical (NaCl)
        const naclInput = screen.getByLabelText(/NaCl/i);
        fireEvent.change(naclInput, { target: { value: '10' } });

        // Button should now be enabled
        expect(screen.getByRole('button', { name: /INITIATE REACTION/i })).not.toBeDisabled();

        // Helper text should be gone
        expect(screen.queryByText(/Add at least two chemicals to initiate reaction/i)).not.toBeInTheDocument();
    });
});
