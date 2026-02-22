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

describe('Lab Component', () => {
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
    });

    it('should have initial state', () => {
        renderLab();
        // Check for chemical inputs
        expect(screen.getByLabelText(/Conc. HCl/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/NaCl/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/CuSO4/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/FeSO4/i)).toBeInTheDocument();
    });
});
