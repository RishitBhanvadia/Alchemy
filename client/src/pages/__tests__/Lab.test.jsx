import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Lab from '../lab';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}));

// Mock CanvasContainer as it might use Three.js which fails in JSDOM
// We ignore children (lights) to prevent React warnings about unrecognized tags like <ambientLight>
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: () => <div data-testid="canvas-container" />,
}));

// Mock CustomTestTube to inspect props
vi.mock('../../components/testtube', () => ({
  default: ({ color, hasLiquid }) => (
    <div data-testid="custom-test-tube" data-color={color} data-hasliquid={hasLiquid.toString()} />
  ),
}));

// Mock images
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  it('updates test tube color when chemicals are added', () => {
    render(<Lab />);

    const hclSlider = screen.getByLabelText('Conc. HCl');

    // Initial state: color should be empty
    let testTube = screen.getByTestId('custom-test-tube');
    expect(testTube).toHaveAttribute('data-color', '');

    // Change HCl (chemA)
    fireEvent.change(hclSlider, { target: { value: '10' } });

    // Assert color update
    testTube = screen.getByTestId('custom-test-tube');
    // In the unoptimized version, this might be flaky or wrong due to state lag,
    // but the test environment often flushes updates.
    // If this passes, the optimization is still valid for performance/cleanliness.
    expect(testTube).toHaveAttribute('data-color', '#05B9C4');
  });

  it('prioritizes colors correctly (A > B > C > D)', () => {
    render(<Lab />);

    const hclSlider = screen.getByLabelText('Conc. HCl');
    const naclSlider = screen.getByLabelText('NaCl');

    // Set B (NaCl) -> Green (#04CE7E)
    fireEvent.change(naclSlider, { target: { value: '20' } });
    expect(screen.getByTestId('custom-test-tube')).toHaveAttribute('data-color', '#04CE7E');

    // Set A (HCl) -> Blue (#05B9C4) (should override Green)
    fireEvent.change(hclSlider, { target: { value: '10' } });
    expect(screen.getByTestId('custom-test-tube')).toHaveAttribute('data-color', '#05B9C4');
  });
});
