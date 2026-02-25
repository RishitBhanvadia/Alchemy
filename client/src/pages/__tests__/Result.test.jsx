import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Result from '../result';
import { supabase } from '../../supabaseClient';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      state: {
        chemA: 50,
        chemB: 30,
        chemC: 10,
        chemD: 10
      }
    }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    to: vi.fn(),
  }
}));

// Mock child components that might cause issues
vi.mock('../../components/result_testtube', () => ({
  default: () => <div data-testid="mock-test-tube">Test Tube</div>
}));

vi.mock('../../components/banner', () => ({
  default: () => <div data-testid="mock-bubble">Bubble</div>
}));

describe('Result Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          color: "#00ff00",
          product_name: "Test Product",
          product_info: "Test Info",
          product_properties: ["Prop 1"],
          product_uses: ["Use 1"],
          gas: false,
          solid: false
        }]),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders result and attempts to save to Supabase when user is logged in', async () => {
    // Mock logged in user
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    });

    const insertMock = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({
        insert: insertMock
    });

    render(<Result />);

    // Wait for the result to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalled();

    // Verify Supabase insert was called
    // This expectation is expected to FAIL currently
    expect(supabase.from).toHaveBeenCalledWith('experiment_results');
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'test-user-id',
      experiment_type: 'Chemical Reaction',
      score: 100,
      details: expect.objectContaining({
        conc_a: 50,
        product: "Test Product"
      })
    }));
  });
});
