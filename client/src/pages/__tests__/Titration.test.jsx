import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Titration from '../titration';
import { MemoryRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Titration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state correctly', () => {
    render(
      <MemoryRouter>
        <Titration />
      </MemoryRouter>
    );

    expect(screen.getByText(/TITRATION SETUP/i)).toBeInTheDocument();
    expect(screen.getByText(/CONFIRM SELECTION/i)).toBeEnabled();
    expect(screen.getByText(/ADD 10ML ACID/i)).toBeDisabled();
    expect(screen.getByText(/ADD INDICATOR/i)).toBeDisabled();
    expect(screen.getByText(/DROP/i)).toBeDisabled();
    expect(screen.getByText(/STOP/i)).toBeDisabled();
    expect(screen.getByText(/SHAKE/i)).toBeDisabled();
  });

  it('handles setup flow correctly', async () => {
    render(
      <MemoryRouter>
        <Titration />
      </MemoryRouter>
    );

    // Click Confirm Selection
    const confirmBtn = screen.getByText(/CONFIRM SELECTION/i);
    fireEvent.click(confirmBtn);

    expect(confirmBtn).toBeDisabled();
    const addAcidBtn = screen.getByText(/ADD 10ML ACID/i);
    expect(addAcidBtn).toBeEnabled();

    // Click Add Acid
    fireEvent.click(addAcidBtn);
    expect(addAcidBtn).toBeDisabled();
    const addIndicatorBtn = screen.getByText(/ADD INDICATOR/i);
    expect(addIndicatorBtn).toBeEnabled();

    // Click Add Indicator
    fireEvent.click(addIndicatorBtn);
    expect(addIndicatorBtn).toBeDisabled();
    const dropBtn = screen.getByText(/DROP/i);
    expect(dropBtn).toBeEnabled();
    const shakeBtn = screen.getByText(/SHAKE/i);
    expect(shakeBtn).toBeEnabled();
  });

  it('handles titration process (drop and stop)', async () => {
    render(
      <MemoryRouter>
        <Titration />
      </MemoryRouter>
    );

    // Setup first
    fireEvent.click(screen.getByText(/CONFIRM SELECTION/i));
    fireEvent.click(screen.getByText(/ADD 10ML ACID/i));
    fireEvent.click(screen.getByText(/ADD INDICATOR/i));

    const dropBtn = screen.getByText(/DROP/i);
    const stopBtn = screen.getByText(/STOP/i);

    // Start dropping
    fireEvent.click(dropBtn);
    expect(dropBtn).toBeDisabled();
    expect(stopBtn).toBeEnabled();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(1000); // 1 second = 10 counts (since interval is 100ms)
    });

    // Stop dropping
    fireEvent.click(stopBtn);
    expect(stopBtn).toBeDisabled();
    expect(dropBtn).toBeEnabled();
  });

  it('handles shake functionality', async () => {
    render(
      <MemoryRouter>
        <Titration />
      </MemoryRouter>
    );

    // Setup first
    fireEvent.click(screen.getByText(/CONFIRM SELECTION/i));
    fireEvent.click(screen.getByText(/ADD 10ML ACID/i));
    fireEvent.click(screen.getByText(/ADD INDICATOR/i));

    const shakeBtn = screen.getByText(/SHAKE/i);
    fireEvent.click(shakeBtn);

    // Should verify state change (e.g., color change logic triggers)
    // Since color change depends on count, and count is 0, it might not change immediately visible state easily without deeper inspection.
    // However, clicking it shouldn't crash.
    expect(shakeBtn).toBeEnabled();
  });
});
