import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock dependencies
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}));

// Mock CustomTestTube
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="custom-test-tube">Test Tube</div>,
}));

// Mock static assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Lab page correctly', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    // Check for main elements
    expect(screen.getByText('CHEMICAL RACK')).toBeInTheDocument();
    expect(screen.getByText('Conc. HCl')).toBeInTheDocument();
    expect(screen.getByText('NaCl')).toBeInTheDocument();
    expect(screen.getByText('CuSO4')).toBeInTheDocument();
    expect(screen.getByText('FeSO4')).toBeInTheDocument();

    // Check for CustomTestTube
    expect(screen.getByTestId('custom-test-tube')).toBeInTheDocument();

    // Check for button
    expect(screen.getByRole('button', { name: /INITIATE REACTION/i })).toBeInTheDocument();
  });
});
