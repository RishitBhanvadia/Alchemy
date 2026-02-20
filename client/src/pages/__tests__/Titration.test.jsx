import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Titration from '../titration';

// Mock assets
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

// Mock components
vi.mock('../../components/Navbar', () => ({ default: () => <div data-testid="navbar">Navbar</div> }));
vi.mock('../../components/Polygon', () => ({ default: ({ c }) => <div data-testid="polygon" data-count={c}>Polygon</div> }));
vi.mock('../../components/titration_setup', () => ({
    default: ({ aheigth, color, shaky, count }) => (
        <div data-testid="titration-setup" data-height={aheigth} data-color={color} data-shaky={shaky ? "true" : "false"} data-count={count}>
            TitrationSetup
        </div>
    )
}));

// Mock Supabase
const { mockAuthGetUser, mockInsert, mockFrom } = vi.hoisted(() => {
    const mockInsert = vi.fn();
    const mockFrom = vi.fn(() => ({ insert: mockInsert }));
    const mockAuthGetUser = vi.fn();
    return { mockAuthGetUser, mockInsert, mockFrom };
});

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: mockAuthGetUser,
        },
        from: mockFrom,
    },
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        log: vi.fn(),
    }
}));

describe('Titration Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Mock user logged in
        mockAuthGetUser.mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null
        });
        mockInsert.mockResolvedValue({ error: null });
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

    it('renders initial state correctly', () => {
        renderTitration();
        expect(screen.getByText('TITRATION SETUP')).toBeInTheDocument();
        expect(screen.getByText('ACID:')).toBeInTheDocument();
        expect(screen.getByText('BASE:')).toBeInTheDocument();
        expect(screen.getByText('HCl')).toBeInTheDocument(); // Default acid
        expect(screen.getByRole('button', { name: /confirm selection/i })).toBeInTheDocument();
    });

    it('allows selecting acid and confirming', () => {
        renderTitration();
        const nextButton = screen.getByText('>');
        fireEvent.click(nextButton);
        expect(screen.getByText('H2SO4')).toBeInTheDocument();

        const confirmButton = screen.getByRole('button', { name: /confirm selection/i });
        fireEvent.click(confirmButton);

        // After confirm, "ADD 10ML ACID" should be enabled (disabled check fails if enabled)
        const addAcidButton = screen.getByRole('button', { name: /add 10ml acid/i });
        expect(addAcidButton).not.toBeDisabled();
    });

    it('runs titration simulation and saves result', async () => {
        renderTitration();

        // 1. Confirm Selection (default HCl)
        fireEvent.click(screen.getByRole('button', { name: /confirm selection/i }));

        // 2. Add Acid
        const addAcidButton = screen.getByRole('button', { name: /add 10ml acid/i });
        fireEvent.click(addAcidButton);

        // 3. Add Indicator (KMnO4)
        const addIndicatorButton = screen.getByRole('button', { name: /add indicator/i });
        expect(addIndicatorButton).not.toBeDisabled();
        fireEvent.click(addIndicatorButton);

        // 4. Start Drop
        const dropButton = screen.getByRole('button', { name: /drop/i });
        expect(dropButton).not.toBeDisabled();

        // Use act to wrap state updates inside timers
        await act(async () => {
            fireEvent.click(dropButton);
            // Advance time to simulate dropping
            // Target is 100 counts. Interval is 100ms. So 100 * 100ms = 10000ms = 10s.
            // Let's stop at count 50 (5000ms)
            vi.advanceTimersByTime(5000);
        });

        // 5. Stop Drop
        const stopButton = screen.getByRole('button', { name: /stop/i });
        expect(stopButton).not.toBeDisabled();

        await act(async () => {
            fireEvent.click(stopButton);
        });

        // Verify "Result saved to database!" message (Score message is overwritten quickly)
        expect(screen.getByText('Result saved to database!')).toBeInTheDocument();

        // Verify Supabase Insert
        expect(mockFrom).toHaveBeenCalledWith('experiment_results');
        expect(mockInsert).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                user_id: 'test-user-id',
                experiment_type: 'Titration',
                score: expect.any(Number),
                details: expect.objectContaining({
                    acid: 'HCl'
                })
            })
        ]));
    });
});
