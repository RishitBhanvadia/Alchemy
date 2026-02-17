import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import History from '../history';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('History Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when no experiments found', async () => {
    // Mock user
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock empty experiments
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
        expect(screen.queryByText(/LOADING ARCHIVES/i)).not.toBeInTheDocument();
    });

    // Check for empty state elements
    expect(screen.getByText('No Experiments Found')).toBeInTheDocument();
    expect(screen.getByText(/Your experiment logs are empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Go to Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Go to Titration/i)).toBeInTheDocument();
  });
});
