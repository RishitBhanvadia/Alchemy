import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock the CanvasContainer to avoid Three.js issues in JSDOM
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: () => <div data-testid="canvas-container" />
}));

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}));

// Mock image assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  it('shows helper text when disabled and hides it when chemicals are added', () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /initiate reaction/i });
    expect(button).toBeDisabled();

    // Verify helper text IS present initially
    const helperText = screen.getByText(/Add at least two chemicals to initiate reaction/i);
    expect(helperText).toBeInTheDocument();

    // Add chemical A (Conc. HCl)
    const chemAInput = screen.getByLabelText(/Conc. HCl/i);
    fireEvent.change(chemAInput, { target: { value: '50' } });

    // Still disabled (need 2 chemicals)
    expect(button).toBeDisabled();
    expect(screen.getByText(/Add at least two chemicals/i)).toBeInTheDocument();

    // Add chemical B (NaCl)
    const chemBInput = screen.getByLabelText(/NaCl/i);
    fireEvent.change(chemBInput, { target: { value: '20' } });

    // Should be enabled now
    expect(button).not.toBeDisabled();
    // Helper text should be gone
    expect(screen.queryByText(/Add at least two chemicals/i)).not.toBeInTheDocument();
  });
});
