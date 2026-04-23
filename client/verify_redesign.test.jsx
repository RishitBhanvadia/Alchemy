import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResultModal from './src/components/ResultModal';

describe('ResultModal Confirmation Dialog UI', () => {
  it('should render the confirmation dialog when Reset Lab is clicked', () => {
    const mockOnReset = vi.fn();
    const mockOnClose = vi.fn();
    const mockOnAskAI = vi.fn();

    const result = {
      outcome_label: 'Water',
      product_formula: 'H2O',
      color: 'Clear',
      state_change: 'Liquid',
      thermal_effect: 'None',
      is_dangerous: false,
    };

    render(
      <ResultModal
        isOpen={true}
        result={result}
        onReset={mockOnReset}
        onClose={mockOnClose}
        onAskAI={mockOnAskAI}
      />
    );

    // Initial state: "Reset Lab" button should be visible
    const initialResetBtn = screen.getByRole('button', { name: /Reset Lab/i });
    expect(initialResetBtn).toBeInTheDocument();

    // Click "Reset Lab"
    fireEvent.click(initialResetBtn);

    // Confirmation dialog should appear
    expect(screen.getByText(/Are you sure you want to reset\?/i)).toBeInTheDocument();

    // "Yes, Reset" and "Cancel" buttons should be visible
    const confirmResetBtn = screen.getByRole('button', { name: /Yes, Reset/i });
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    expect(confirmResetBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();

    // Click "Yes, Reset"
    fireEvent.click(confirmResetBtn);
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
