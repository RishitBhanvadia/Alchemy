import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab3D from '../Lab3D';
import useLabStore from '../../store/labStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Mock dependencies
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
        })),
    },
}));

vi.mock('axios');
vi.mock('react-hot-toast');
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
}));

describe('Lab3D Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset Zustand store manually for each test to ensure clean state
        useLabStore.setState({
            chemA: 0,
            chemB: 0,
            chemC: 0,
            chemD: 0,
            currentHint: null,
            lastReactionResult: null,
            setChemA: (val) => useLabStore.setState({ chemA: val }),
            setChemB: (val) => useLabStore.setState({ chemB: val }),
            setChemC: (val) => useLabStore.setState({ chemC: val }),
            setChemD: (val) => useLabStore.setState({ chemD: val }),
            setCurrentHint: (val) => useLabStore.setState({ currentHint: val }),
            setLastReactionResult: (val) => useLabStore.setState({ lastReactionResult: val }),
        });
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <Lab3D />
            </BrowserRouter>
        );
    };

    it('should render lab title and controls', () => {
        renderComponent();
        expect(screen.getByText(/3D PHYSICS LABORATORY/i)).toBeInTheDocument();
        expect(screen.getByText(/Experiment Controls/i)).toBeInTheDocument();
    });

    it('should have disabled initiate button when less than 2 chemicals are selected', () => {
        renderComponent();
        const initiateButton = screen.getByRole('button', { name: /INITIATE REACTION/i });
        expect(initiateButton).toBeDisabled();
        expect(screen.getByText(/Mix at least 2 chemicals to start/i)).toBeInTheDocument();
    });

    it('should enable initiate button when at least 2 chemicals are selected', async () => {
        renderComponent();

        // Find sliders
        const sliders = screen.getAllByRole('slider');

        // Simulate setting 2 chemicals
        fireEvent.change(sliders[0], { target: { value: 50 } }); // chemA
        fireEvent.change(sliders[1], { target: { value: 50 } }); // chemB

        await waitFor(() => {
            const initiateButton = screen.getByRole('button', { name: /INITIATE REACTION/i });
            expect(initiateButton).not.toBeDisabled();
        });
    });

    it('should handle reaction initiation correctly', async () => {
        // Mock successful API response
        const mockResponse = { data: { message: 'Reaction Success' }, status: 200 };
        axios.post.mockResolvedValueOnce(mockResponse);

        renderComponent();

        // Find sliders and set values to enable button
        const sliders = screen.getAllByRole('slider');
        fireEvent.change(sliders[0], { target: { value: 50 } }); // chemA
        fireEvent.change(sliders[1], { target: { value: 50 } }); // chemB

        const initiateButton = screen.getByRole('button', { name: /INITIATE REACTION/i });

        // Click button
        fireEvent.click(initiateButton);

        // Verify button state changes to loading
        expect(screen.getByText(/REACTING.../i)).toBeInTheDocument();
        expect(initiateButton).toBeDisabled();

        // Verify API was called with correct payload
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/results', {
                chem_a: 50,
                chem_b: 50,
                chem_c: 0,
                chem_d: 0,
                student_id: 'test-user-id',
                experiment_type: 'inorganic'
            });
        });
    });

    it('should show error toast on reaction failure', async () => {
        // Mock API failure
        axios.post.mockRejectedValueOnce({
            response: { data: { error: 'Invalid chemical combination' } }
        });

        renderComponent();

        const sliders = screen.getAllByRole('slider');
        fireEvent.change(sliders[0], { target: { value: 50 } });
        fireEvent.change(sliders[1], { target: { value: 50 } });

        const initiateButton = screen.getByRole('button', { name: /INITIATE REACTION/i });
        fireEvent.click(initiateButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid chemical combination');
        });
    });
});
