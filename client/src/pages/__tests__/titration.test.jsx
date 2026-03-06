import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Titration from '../titration';

// Mock child components to isolate the page logic
vi.mock('../../components/Navbar', () => ({
    default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));
vi.mock('../../components/Polygon', () => ({
    default: () => <div data-testid="mock-polygon">Polygon</div>,
}));
vi.mock('../../components/titration_setup', () => ({
    default: () => <div data-testid="mock-titration-setup">Titration Setup</div>,
}));

// Mock supabaseClient
vi.mock('../../supabaseClient', () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({ insert: mockInsert }));
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: '123' } } });

    return {
        supabase: {
            auth: { getUser: mockGetUser },
            from: mockFrom,
        },
        mockInsert, // export for tests
        mockFrom,
        mockGetUser
    };
});

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('Titration Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const renderTitration = () => {
        return render(
            <BrowserRouter>
                <Titration />
            </BrowserRouter>
        );
    };

    it('should render initial titration setup controls', () => {
        renderTitration();

        expect(screen.getByText('TITRATION SETUP')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'CONFIRM SELECTION' })).toBeInTheDocument();
        expect(screen.getByText('HCl')).toBeInTheDocument();
        expect(screen.getByText('NaOH')).toBeInTheDocument();
    });

    it('should allow toggling acid selection before confirm', () => {
        renderTitration();

        const rightArrow = screen.getByRole('button', { name: '>' });
        act(() => {
            fireEvent.click(rightArrow);
        });
        expect(screen.getByText('H2SO4')).toBeInTheDocument();

        const leftArrow = screen.getByRole('button', { name: '<' });
        act(() => {
            fireEvent.click(leftArrow);
        });
        expect(screen.getByText('HCl')).toBeInTheDocument();
    });

    it('should progress through experiment steps', async () => {
        const { mockGetUser, mockFrom, mockInsert } = await import('../../supabaseClient');
        renderTitration();

        // Step 1: Confirm selection
        const confirmBtn = screen.getByRole('button', { name: 'CONFIRM SELECTION' });
        act(() => {
            fireEvent.click(confirmBtn);
        });

        // Step 2: Add Acid
        const addAcidBtn = screen.getByRole('button', { name: 'ADD 10ML ACID' });
        expect(addAcidBtn).not.toBeDisabled();
        act(() => {
            fireEvent.click(addAcidBtn);
        });

        // Step 3: Add Indicator
        const addIndicatorBtn = screen.getByRole('button', { name: 'ADD INDICATOR (KMnO4)' });
        expect(addIndicatorBtn).not.toBeDisabled();
        act(() => {
            fireEvent.click(addIndicatorBtn);
        });

        // Step 4: Drop
        const dropBtn = screen.getByRole('button', { name: 'DROP' });
        expect(dropBtn).not.toBeDisabled();

        // Start dropping
        act(() => {
            fireEvent.click(dropBtn);
        });

        // Advance timers to simulate dropping (count increases every 100ms)
        act(() => {
            vi.advanceTimersByTime(500); // Should increment count by 5
        });

        // Step 5: Stop
        const stopBtn = screen.getByRole('button', { name: 'STOP' });
        expect(stopBtn).not.toBeDisabled();

        // Use promise for the save result logic before calling act and clicking stop
        let resolveSave;
        const savePromise = new Promise((resolve) => {
             resolveSave = resolve;
        });

        mockInsert.mockImplementation(() => {
           resolveSave();
           return Promise.resolve({ error: null });
        });

        // Need to wrap the real timer switch in act since state changes will happen asynchronously
        act(() => {
           fireEvent.click(stopBtn);
        });

        // Since we are using fake timers, and the saveResult logic uses async/await, we need to flush promises.
        // Wait for the mock insert to be called
        await savePromise;

        // Verify saveResult was called
        expect(mockGetUser).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith('experiment_results');
        expect(mockInsert).toHaveBeenCalled();

        // Check if score message appears
        expect(screen.getByText(/Score:/)).toBeInTheDocument();
    });

    it('should handle shaking', () => {
        renderTitration();

        const confirmBtn = screen.getByRole('button', { name: 'CONFIRM SELECTION' });
        act(() => { fireEvent.click(confirmBtn); });
        const addAcidBtn = screen.getByRole('button', { name: 'ADD 10ML ACID' });
        act(() => { fireEvent.click(addAcidBtn); });
        const addIndicatorBtn = screen.getByRole('button', { name: 'ADD INDICATOR (KMnO4)' });
        act(() => { fireEvent.click(addIndicatorBtn); });

        const shakeBtn = screen.getByRole('button', { name: 'SHAKE' });
        expect(shakeBtn).not.toBeDisabled();

        act(() => {
            fireEvent.click(shakeBtn);
        });

        // Verify shaking state is active (timeout clears it)
        act(() => {
             vi.advanceTimersByTime(600);
        });
    });
});
