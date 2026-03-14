import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab3D from '../Lab3D';
import useLabStore from '../../store/labStore';

// Mock dependencies
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({}),
    },
}));

vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
}));

vi.mock('../../store/labStore', () => {
    return {
        default: vi.fn(() => ({
            chemA: 0,
            setChemA: vi.fn(),
            chemB: 0,
            setChemB: vi.fn(),
            chemC: 0,
            setChemC: vi.fn(),
            chemD: 0,
            setChemD: vi.fn(),
            setLastReactionResult: vi.fn(),
            currentHint: null,
            setCurrentHint: vi.fn(),
        })),
    };
});

describe('Lab3D Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLab3D = () => {
        return render(
            <BrowserRouter>
                <Lab3D />
            </BrowserRouter>
        );
    };

    it('should render lab interface correctly', async () => {
        renderLab3D();
        expect(screen.getByText(/3D PHYSICS LABORATORY/i)).toBeInTheDocument();
        expect(screen.getByText(/Hydrochloric Acid/i)).toBeInTheDocument();
        expect(screen.getByText(/Sodium Hydroxide/i)).toBeInTheDocument();
        expect(screen.getByText(/Phenolphthalein/i)).toBeInTheDocument();
        expect(screen.getByText(/Iron\(III\) Chloride/i)).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /INITIATE REACTION/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });
});