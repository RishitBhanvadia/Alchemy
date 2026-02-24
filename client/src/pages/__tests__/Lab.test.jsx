import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Lab from '../lab';

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock GSAP
vi.mock('gsap', () => {
    return {
        gsap: {
            context: vi.fn((cb) => {
                // Execute the callback immediately to simulate context creation
                if (cb) cb();
                return { revert: vi.fn() };
            }),
            fromTo: vi.fn(),
            to: vi.fn(),
        }
    }
});

// Mock the TestTube component as it might have issues or just to simplify
vi.mock('../../components/testtube', () => ({
    default: () => <div data-testid="mock-test-tube">Test Tube</div>
}));

// Mock images to avoid import errors if not handled by build tools in test env
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Lab page with chemical rack', () => {
    render(<Lab />);

    // Check for main title
    expect(screen.getByText(/CHEMICAL RACK/i)).toBeInTheDocument();

    // Check for chemical inputs
    expect(screen.getByLabelText(/Conc. HCl/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NaCl/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CuSO4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/FeSO4/i)).toBeInTheDocument();

    // Check for initiate button
    expect(screen.getByRole('button', { name: /INITIATE REACTION/i })).toBeInTheDocument();
  });

  it('updates chemical values when sliders change', () => {
    render(<Lab />);

    const hclSlider = screen.getByLabelText(/Conc. HCl/i);
    fireEvent.change(hclSlider, { target: { value: 50 } });

    expect(hclSlider.value).toBe("50");
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
