import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Titration from '../titration';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } })
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null })
    })
  }
}));

// Mock the API which will fail and trigger fallback
vi.mock('../../utils/api', () => ({
  getTitrationData: vi.fn().mockRejectedValue(new Error('API failed'))
}));

describe('Titration Component Bug Fix', () => {
  it('does not crash when SHAKE is clicked and data is partially missing', async () => {
    render(
      <MemoryRouter>
        <Titration />
      </MemoryRouter>
    );

    // Wait for initial render to settle
    await screen.findByRole('heading', { name: /TITRATION SETUP/i });

    // Initial setup with base to make fallback[1] undefined
    const baseArrow = screen.getAllByRole('button', { name: '>' })[0];
    await userEvent.click(baseArrow);

    const confirmBtn = screen.getByRole('button', { name: 'CONFIRM SELECTION' });
    await userEvent.click(confirmBtn);

    const addAcidBtn = await screen.findByRole('button', { name: 'ADD 10ML ACID' });
    await userEvent.click(addAcidBtn);

    const addKmnBtn = await screen.findByRole('button', { name: 'ADD INDICATOR (KMnO4)' });
    await userEvent.click(addKmnBtn);

    const shakeBtn = await screen.findByRole('button', { name: 'SHAKE' });
    await userEvent.click(shakeBtn);

    // If it doesn't crash, the UI remains rendered (the component doesn't unmount).
    // We can assert the page is still visible.
    const setupHeading = await screen.findByRole('heading', { name: /TITRATION SETUP/i });
    expect(setupHeading).toBeInTheDocument();
  });
});
