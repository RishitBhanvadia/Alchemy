import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Lab from '../lab';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
  },
}));

// Fix path to point to the actual file location relative to this test file
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({children}) => <div data-testid="canvas-container">{children}</div>,
}));

// Also mock CustomTestTube to avoid any issues there
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="custom-test-tube">Test Tube</div>,
}));

// Polyfill ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Lab Component', () => {
  test('renders correctly', () => {
    render(<Lab />);
    expect(screen.getByText('CHEMICAL RACK')).toBeInTheDocument();
  });

  test('button is disabled initially with helper text', () => {
    render(<Lab />);
    const button = screen.getByRole('button', { name: /initiate reaction/i });
    expect(button).toBeDisabled();
    // This is the UX improvement we are adding
    expect(screen.getByText('Add at least two chemicals to initiate reaction')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-describedby', 'play-helper');
  });

  test('button becomes enabled when two chemicals are added', () => {
    render(<Lab />);
    const button = screen.getByRole('button', { name: /initiate reaction/i });

    // Find inputs
    const inputA = screen.getByLabelText('Conc. HCl');
    const inputB = screen.getByLabelText('NaCl');

    fireEvent.change(inputA, { target: { value: '10' } });
    fireEvent.change(inputB, { target: { value: '10' } });

    expect(button).toBeEnabled();
    // Helper text should be gone
    expect(screen.queryByText('Add at least two chemicals to initiate reaction')).not.toBeInTheDocument();
  });
});
