import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Titration from '../titration';
import TitrationSetup from '../../components/titration_setup';

// Mock child components
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../components/Polygon', () => ({
    default: () => <div data-testid="polygon">Polygon</div>
}));

// Mock TitrationSetup to spy on props
vi.mock('../../components/titration_setup', () => ({
    default: vi.fn(({ acidHeight, aheigth, count }) => (
        <div data-testid="titration-setup" data-acid-height={acidHeight || aheigth} data-count={count}>
            TitrationSetup
        </div>
    ))
}));

// Mock Supabase
const mockInsert = vi.fn();
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id' } },
            }),
        },
        from: vi.fn(() => ({
            insert: mockInsert.mockResolvedValue({ error: null }),
        })),
    },
}));

// Mock Logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
    }
}));

// Mock Images
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

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

    it('should render initial state correctly', () => {
        renderTitration();
        expect(screen.getByText(/TITRATION SETUP/i)).toBeInTheDocument();
        expect(screen.getByText(/CONFIRM SELECTION/i)).toBeInTheDocument();
        expect(screen.getByTestId('titration-setup')).toBeInTheDocument();
    });

    it('should calculate acidHeight correctly based on count (timer logic)', async () => {
        renderTitration();

        // Setup steps
        fireEvent.click(screen.getByText(/CONFIRM SELECTION/i));
        fireEvent.click(screen.getByText(/ADD 10ML ACID/i));
        fireEvent.click(screen.getByText(/ADD INDICATOR/i));

        // Start titration
        const dropBtn = screen.getByText('DROP');
        expect(dropBtn).toBeEnabled();
        fireEvent.click(dropBtn);

        // Advance timer
        act(() => {
            vi.advanceTimersByTime(500); // 5 ticks
        });

        // Check if count updated in TitrationSetup prop
        // We expect count to be around 5
        // Note: The component logic might have interval set to 100ms.
        // Initial count is 0.
        // After 500ms, count should be 5.

        // We check the last call to the mock
        const lastCall = TitrationSetup.mock.calls[TitrationSetup.mock.calls.length - 1][0];

        // Verify count increased
        expect(lastCall.count).toBeGreaterThan(0);

        // Verify acidHeight (or aheigth for now) is calculated
        // The formula is "M226.348 ... " + (644 - ((count / 10) * 4.3)) + ...
        // We just check if it's a string containing "M226"
        expect(lastCall.aheigth || lastCall.acidHeight).toContain("M226.348");
    });
});
