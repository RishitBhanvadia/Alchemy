import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock assets if needed (usually handled by Vite/Vitest, but just in case)
// We rely on default behavior for now.

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

    it('should render Lab page without crashing', () => {
        renderLab();
        expect(screen.getByText(/CHEMICAL RACK/i)).toBeInTheDocument();
        expect(screen.getByText(/INITIATE REACTION/i)).toBeInTheDocument();
    });

    it('should update chemical sliders', () => {
        renderLab();
        const hclSlider = screen.getByLabelText(/Conc. HCl/i);
        fireEvent.change(hclSlider, { target: { value: '50' } });
        expect(screen.getByText('50%')).toBeInTheDocument();
    });
});
