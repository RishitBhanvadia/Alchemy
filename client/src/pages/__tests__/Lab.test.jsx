import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn().mockReturnValue({ revert: vi.fn() }),
  }
}));

// Mock CanvasContainer
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

// Mock CustomTestTube (SVG)
vi.mock('../../components/testtube', () => ({
  default: () => <svg data-testid="test-tube" />
}));

// Mock Image Assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

const renderLab = () => {
  return render(
    <BrowserRouter>
      <Lab />
    </BrowserRouter>
  );
};

describe('Lab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial empty state correctly', () => {
    renderLab();
    // Check for new Status Panel text (which doesn't exist yet)
    // This expects the IMPROVED state.
    expect(screen.getByText(/REACTION MONITOR/i)).toBeInTheDocument();
    expect(screen.getByText(/AWAITING INPUT/i)).toBeInTheDocument();

    // Check Guidance Message
    expect(screen.getByText(/Select a chemical from the rack to begin/i)).toBeInTheDocument();

    // Check Button Text
    // Note: getByRole might fail if the text doesn't match, which is what we want
    expect(screen.getByRole('button')).toHaveTextContent(/SELECT REACTANTS/i);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('updates status when chemicals are added', () => {
    renderLab();

    // Find sliders
    const hclSlider = screen.getByLabelText(/Conc. HCl/i);

    // Add 1 chemical
    fireEvent.change(hclSlider, { target: { value: '50' } });

    // Expect status update
    expect(screen.getByText(/Select at least one more chemical/i)).toBeInTheDocument();
    expect(screen.getByText(/AWAITING INPUT/i)).toBeInTheDocument(); // Still awaiting

    // Add 2nd chemical
    const naclSlider = screen.getByLabelText(/NaCl/i);
    fireEvent.change(naclSlider, { target: { value: '30' } });

    // Expect Ready state
    expect(screen.getByText(/READY TO REACT/i)).toBeInTheDocument();
    expect(screen.getByText(/Reaction conditions met/i)).toBeInTheDocument();

    // Check Button Text
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/INITIATE REACTION/i);
    expect(button).toBeEnabled();
  });
});
