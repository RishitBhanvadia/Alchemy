import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock images
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        context: (func) => {
            func();
            return { revert: vi.fn() };
        },
        fromTo: vi.fn(),
    }
}));

// Mock CanvasContainer
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
    default: ({ children }) => <div>CanvasContainer Mock {children}</div>
}));

// Mock CustomTestTube to avoid complexity
vi.mock('../../components/testtube', () => ({
    default: ({ color, hasLiquid }) => <div data-testid="test-tube" style={{ color: color }}>TestTube: {hasLiquid ? 'Liquid' : 'Empty'}</div>
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

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

    it('should render lab page', () => {
        renderLab();
        expect(screen.getByText(/CHEMICAL RACK/i)).toBeInTheDocument();
        expect(screen.getByText(/STATUS/i)).toBeInTheDocument();
    });

    it('should disable INITIATE REACTION button initially', () => {
        renderLab();
        const button = screen.getByRole('button', { name: /INITIATE REACTION/i });
        expect(button).toBeDisabled();
    });

    it('should update chemical amounts', () => {
        renderLab();
        const hclInput = screen.getByLabelText(/Conc. HCl/i);
        fireEvent.change(hclInput, { target: { value: '20' } });
        expect(hclInput.value).toBe('20');
        expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('should enable button when at least 2 chemicals are added', () => {
        renderLab();
        const button = screen.getByRole('button', { name: /INITIATE REACTION/i });
        const hclInput = screen.getByLabelText(/Conc. HCl/i);
        const naclInput = screen.getByLabelText(/NaCl/i);

        // Add 1st chemical
        fireEvent.change(hclInput, { target: { value: '10' } });
        expect(button).toBeDisabled();

        // Add 2nd chemical
        fireEvent.change(naclInput, { target: { value: '10' } });
        expect(button).toBeEnabled();
    });

    it('should update test tube color based on priority (A > B > C > D)', async () => {
        renderLab();
        // A: HCl (#05B9C4), B: NaCl (#04CE7E), C: CuSO4 (#FBC2E3), D: FeSO4 (#DAA520)

        const feso4Input = screen.getByLabelText(/FeSO4/i);
        const testTube = screen.getByTestId('test-tube');

        // Set D (FeSO4 - #DAA520)
        fireEvent.change(feso4Input, { target: { value: '10' } });

        // Verify color update (Refactor fixes the sync bug, so this should work immediately)
        // Note: The test uses style.color, but the mock applies style={{ color: color }}
        expect(testTube).toHaveStyle({ color: '#DAA520' });
    });
});
