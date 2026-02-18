import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Titration from '../titration';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: vi.fn(),
  },
}));

// Mock Navbar
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock images to avoid issues with file loaders in tests
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

// Mock logger
vi.mock('../../utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Titration Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.reload
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.clearAllMocks();
  });

  it('resets experiment state and does NOT reload page when RESET EXPERIMENT is clicked', () => {
    render(<Titration />);

    const confirmButton = screen.getByText(/CONFIRM SELECTION/i);
    const resetButton = screen.getByText(/RESET EXPERIMENT/i);

    // Initial state: Confirm button should be enabled
    expect(confirmButton).not.toBeDisabled();

    // Interact: Click Confirm Selection
    fireEvent.click(confirmButton);

    // Verify interaction changed state: Confirm button should be disabled
    expect(confirmButton).toBeDisabled();

    // Reset
    fireEvent.click(resetButton);

    // Verify Reset: Confirm button should be enabled again
    expect(confirmButton).not.toBeDisabled();

    // Verify Reload was NOT called
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
