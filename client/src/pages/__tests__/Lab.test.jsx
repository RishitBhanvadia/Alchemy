import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lab from '../lab';
import { BrowserRouter } from 'react-router-dom';

// Mocks
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="test-tube">Test Tube</div>
}));

vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
  }
}));

describe('Lab Page', () => {
  it('renders lab content without crashing', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    expect(screen.getByText('CHEMICAL RACK')).toBeInTheDocument();
    expect(screen.getByText('INITIATE REACTION')).toBeInTheDocument();
    expect(screen.getByTestId('test-tube')).toBeInTheDocument();
  });
});
