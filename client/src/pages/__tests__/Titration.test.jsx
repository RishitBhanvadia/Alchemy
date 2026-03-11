import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Titration from '../titration';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Hoist mocks
const { mockGetUser, mockInsert } = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockInsert: vi.fn(),
  };
});

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: (table) => {
      if (table === 'experiment_results') {
        return { insert: mockInsert };
      }
      return { insert: vi.fn() };
    },
  },
}));

// Mock Navbar since it's used in Titration
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock Polygon and TitrationSetup to simplify rendering
vi.mock('../../components/Polygon', () => ({
  default: () => <div data-testid="polygon">Polygon</div>,
}));

vi.mock('../../components/titration_setup', () => ({
  default: () => <div data-testid="titration-setup">TitrationSetup</div>,
}));

// Mock images
vi.mock('../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../assets/ab.png', () => ({ default: 'ab.png' }));

describe('Titration Component Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display score and persist it after saving to database', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user' } } });
    mockInsert.mockResolvedValue({ error: null });

    render(
      <BrowserRouter>
        <Titration />
      </BrowserRouter>
    );

    // 1. Confirm Selection
    const confirmButton = screen.getByText(/CONFIRM SELECTION/i);
    fireEvent.click(confirmButton);

    // 2. Add Acid
    const addAcidButton = screen.getByText(/ADD 10ML ACID/i);
    fireEvent.click(addAcidButton);

    // 3. Add Indicator
    const addIndicatorButton = screen.getByText(/ADD INDICATOR/i);
    fireEvent.click(addIndicatorButton);

    // 4. Drop (Start)
    const dropButton = screen.getByText(/^DROP$/i);
    fireEvent.click(dropButton);

    // 5. Advance timers to simulate some drops
    act(() => {
      vi.advanceTimersByTime(2000); // 2 seconds -> 20 increments -> count 20
    });

    vi.useRealTimers();

    // 6. Stop
    const stopButton = screen.getByText(/^STOP$/i);
    fireEvent.click(stopButton);

    // Wait for async saveResult to complete
    await waitFor(() => {
        expect(mockGetUser).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalled();
    });

    // We expect the message to contain "Score:"
    // This assertion should FAIL currently because "Result saved to database!" overwrites it.
    const messageElement = await screen.findByText(/Result saved to database!/i);
    expect(messageElement).toBeInTheDocument();

    // Check if score is present (it should be, but bug prevents it)
    expect(messageElement.textContent).toMatch(/Score:/i);
  });
});
