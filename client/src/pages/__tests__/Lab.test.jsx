
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lab from '../lab';
import { BrowserRouter } from 'react-router-dom';

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}));

// Mock components used in Lab that might cause issues or are not relevant
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="test-tube">Test Tube</div>,
}));

// Mock images
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Page', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    // Check if the main elements are present
    expect(screen.getByText('CHEMICAL RACK')).toBeInTheDocument();
    expect(screen.getByText('Conc. HCl')).toBeInTheDocument();

    // Check if CanvasContainer is NOT present (optimization)
    const canvasContainer = screen.queryByTestId('canvas-container');
    expect(canvasContainer).not.toBeInTheDocument();
  });
});
