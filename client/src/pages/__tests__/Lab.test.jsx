import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock dependencies
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
    to: vi.fn(),
    registerPlugin: vi.fn(),
  }
}));

// Mock assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

// Mock CustomTestTube
vi.mock('../../components/testtube', () => ({
  default: () => <div data-testid="test-tube">Test Tube</div>
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Lab Component', () => {
  it('renders chemical controls correctly', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Conc. HCl/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NaCl/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CuSO4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/FeSO4/i)).toBeInTheDocument();
  });

  it('updates chemical values and respects limits', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    const hclInput = screen.getByLabelText(/Conc. HCl/i);
    fireEvent.change(hclInput, { target: { value: '50' } });

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('initiates reaction when enough chemicals are added', async () => {
     render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    const hclInput = screen.getByLabelText(/Conc. HCl/i);
    const naclInput = screen.getByLabelText(/NaCl/i);

    // Add two chemicals to enable the button (onOrNot logic requires >= 2 chemicals > 0)
    fireEvent.change(hclInput, { target: { value: '20' } });
    fireEvent.change(naclInput, { target: { value: '20' } });

    const button = screen.getByRole('button', { name: /INITIATE REACTION/i });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(button).toHaveTextContent('PROCESSING...');

    // Check navigation happened after delay
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/result", expect.objectContaining({
            state: expect.objectContaining({
                chemA: 20,
                chemB: 20
            })
        }));
    }, { timeout: 2000 });
  });
});
