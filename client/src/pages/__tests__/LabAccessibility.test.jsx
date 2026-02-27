import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock the CanvasContainer and 3D components as they cause issues in JSDOM
vi.mock('../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

vi.mock('../components/testtube', () => ({
  default: () => <div data-testid="test-tube">Test Tube</div>
}));

vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: () => {} }),
    fromTo: () => {}
  }
}));

describe('Lab Page Accessibility', () => {
  const renderLab = () => {
    return render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );
  };

  it('should have accessible names for chemical inputs', () => {
    renderLab();

    // Check for aria-labels on inputs
    expect(screen.getByLabelText('Concentration of HCl')).toBeInTheDocument();
    expect(screen.getByLabelText('Concentration of NaCl')).toBeInTheDocument();
    expect(screen.getByLabelText('Concentration of CuSO4')).toBeInTheDocument();
    expect(screen.getByLabelText('Concentration of FeSO4')).toBeInTheDocument();
  });

  it('should show helper text when Initiate Reaction is disabled', () => {
    renderLab();

    // Initially no chemicals, so button should be disabled and helper text visible
    const button = screen.getByRole('button', { name: /initiate reaction/i });
    expect(button).toBeDisabled();

    // Check for helper text
    expect(screen.getByText('Add at least two chemicals to initiate reaction')).toBeInTheDocument();
  });

  it('should hide helper text and enable button when chemicals are added', () => {
    renderLab();

    const hclInput = screen.getByLabelText('Concentration of HCl');
    const naclInput = screen.getByLabelText('Concentration of NaCl');

    // Add chemicals (need at least 2 > 0)
    fireEvent.change(hclInput, { target: { value: '10' } });
    fireEvent.change(naclInput, { target: { value: '10' } });

    // Check if button is enabled and text is gone
    const button = screen.getByRole('button', { name: /initiate reaction/i });
    expect(button).not.toBeDisabled();

    expect(screen.queryByText('Add at least two chemicals to initiate reaction')).not.toBeInTheDocument();
  });
});
