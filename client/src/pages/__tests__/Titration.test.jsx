import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Titration from '../titration';

// Hoist mocks to ensure they are available before imports
const mocks = vi.hoisted(() => {
  return {
    insert: vi.fn(() => Promise.resolve({ error: null })),
    getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } })),
    logger: {
      error: vi.fn(),
      info: vi.fn(),
    },
    reload: vi.fn(),
  };
});

// Mock Supabase Client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
    },
    from: vi.fn(() => ({
      insert: mocks.insert,
    })),
  },
}));

// Mock Navbar
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock Assets
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

// Mock Logger
vi.mock('../../utils/logger', () => ({
  default: mocks.logger,
}));

describe('Titration Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock window.location.reload
    delete window.location;
    window.location = { ...originalLocation, reload: mocks.reload };
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    window.location = originalLocation;
  });

  it('renders titration setup correctly', () => {
    render(<Titration />);

    expect(screen.getByText('TITRATION SETUP')).toBeInTheDocument();
    expect(screen.getByText('CONFIRM SELECTION')).toBeInTheDocument();
    expect(screen.getByText('ADD 10ML ACID')).toBeDisabled();
    expect(screen.getByText('ADD INDICATOR (KMnO4)')).toBeDisabled();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('completes experiment flow and saves result', async () => {
    render(<Titration />);

    // 1. Confirm Selection
    const confirmButton = screen.getByText('CONFIRM SELECTION');
    fireEvent.click(confirmButton);
    expect(confirmButton).toBeDisabled();

    // 2. Add Acid
    const addAcidButton = screen.getByText('ADD 10ML ACID');
    expect(addAcidButton).toBeEnabled();
    fireEvent.click(addAcidButton);
    expect(addAcidButton).toBeDisabled();

    // 3. Add Indicator
    const addIndicatorButton = screen.getByText('ADD INDICATOR (KMnO4)');
    expect(addIndicatorButton).toBeEnabled();
    fireEvent.click(addIndicatorButton);
    expect(addIndicatorButton).toBeDisabled();

    // 4. Start Drop
    const dropButton = screen.getByText('DROP');
    expect(dropButton).toBeEnabled();

    // Drop button starts timer. Component updates count every 100ms.
    fireEvent.click(dropButton);
    expect(dropButton).toBeDisabled();

    // Advance timers by some amount (e.g. 5 seconds -> 50 ticks -> count = 50)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // 5. Stop Drop
    const stopButton = screen.getByText('STOP');
    expect(stopButton).toBeEnabled();
    fireEvent.click(stopButton);

    // Verify result save attempt
    expect(mocks.getUser).toHaveBeenCalled();
    // The save logic is async, so we might need to wait, but usually fireEvent is synchronous enough for the call itself to happen if it's not delayed.
    // However, saving to supabase is async.
    // We can use waitFor or check if it was called.
    // The component logic calls `saveResult(count)` immediately inside `handleStop`.

    // Wait for async operations to complete
    await act(async () => {
        await Promise.resolve();
    });

    expect(mocks.insert).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        user_id: 'test-user-id',
        experiment_type: 'Titration',
        // approximate score based on count 50. Target is 100. Diff is 50. Score 50.
        score: 50,
      })
    ]));

    // Check feedback message
    expect(screen.getByText("Result saved to database!")).toBeInTheDocument();
  });

  it('resets experiment on reset button click', () => {
    render(<Titration />);

    const resetButton = screen.getByText('RESET EXPERIMENT');
    fireEvent.click(resetButton);

    expect(mocks.reload).toHaveBeenCalledTimes(1);
  });
});
