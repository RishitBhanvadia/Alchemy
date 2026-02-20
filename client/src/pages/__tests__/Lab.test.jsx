import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lab from '../lab';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));

// Mock CustomTestTube
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="custom-test-tube">Test Tube</div>,
}));

// Mock assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    expect(screen.getByText(/CHEMICAL RACK/i)).toBeInTheDocument();
    expect(screen.getByText(/INITIATE REACTION/i)).toBeInTheDocument();
  });
});
