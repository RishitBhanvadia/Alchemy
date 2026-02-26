import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Titration from '../titration';

// Mocks
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock('../../utils/logger', () => ({
  default: {
    error: vi.fn(),
  }
}));

// Mock assets
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

// Mock components
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../components/titration_setup', () => ({
  default: ({ aheigth, count }) => (
    <div data-testid="titration-setup" data-aheigth={aheigth} data-count={count}>
      TitrationSetup
    </div>
  )
}));

vi.mock('../../components/Polygon', () => ({
  default: () => <div data-testid="polygon">Polygon</div>
}));

describe('Titration Component Performance', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<Titration />);
    expect(screen.getByText('TITRATION SETUP')).toBeInTheDocument();
  });

  it('starts interval only once and does not restart on every tick', async () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    render(<Titration />);

    // 1. Confirm Selection
    const confirmBtn = screen.getByText('CONFIRM SELECTION');
    fireEvent.click(confirmBtn);

    // 2. Add Acid
    const addAcidBtn = screen.getByText('ADD 10ML ACID');
    fireEvent.click(addAcidBtn);

    // 3. Add Indicator
    const addIndicatorBtn = screen.getByText(/ADD INDICATOR/);
    fireEvent.click(addIndicatorBtn);

    // 4. Start Drop (initiate timer)
    const dropBtn = screen.getByText('DROP');
    fireEvent.click(dropBtn);

    // Advance time by 350ms (should be ~3 ticks)
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Optimized version should be 1.
    const callCount = setIntervalSpy.mock.calls.length;
    expect(callCount).toBe(1);
  });

  it('updates count and acid height correctly during titration', async () => {
    render(<Titration />);

    // Setup steps
    fireEvent.click(screen.getByText('CONFIRM SELECTION'));
    fireEvent.click(screen.getByText('ADD 10ML ACID'));
    fireEvent.click(screen.getByText(/ADD INDICATOR/));

    const setup = screen.getByTestId('titration-setup');

    // Before drop
    expect(setup).toHaveAttribute('data-count', '0');

    // Start Drop
    fireEvent.click(screen.getByText('DROP'));

    // Advance 1 tick (100ms)
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Count should increment
    expect(setup).toHaveAttribute('data-count', '1');

    // Acid height should update
    // 644 - (1/10 * 4.3) = 643.57
    const heightAttr = setup.getAttribute('data-aheigth');
    expect(heightAttr).toContain('643.57');
  });
});
