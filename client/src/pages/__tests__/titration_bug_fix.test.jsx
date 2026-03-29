import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Titration from '../titration';
import { vi } from 'vitest';

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

    // Initial setup with base to make fallback[1] undefined
    const baseArrow = screen.getAllByRole('button', { name: '>' })[0];
    fireEvent.click(baseArrow);

    const confirmBtn = screen.getByRole('button', { name: 'CONFIRM SELECTION' });
    fireEvent.click(confirmBtn);

    const addAcidBtn = screen.getByRole('button', { name: 'ADD 10ML ACID' });
    fireEvent.click(addAcidBtn);

    const addKmnBtn = screen.getByRole('button', { name: 'ADD INDICATOR (KMnO4)' });
    fireEvent.click(addKmnBtn);

    const shakeBtn = screen.getByRole('button', { name: 'SHAKE' });

    // This will not throw because of the fix
    expect(() => fireEvent.click(shakeBtn)).not.toThrow();
  });
});
