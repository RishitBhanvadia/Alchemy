import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PropTypes from 'prop-types';
import Lab from '../lab';
import { BrowserRouter } from 'react-router-dom';

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
  },
}));

// Mock 3D components
const MockCanvasContainer = ({ children }) => <div data-testid="canvas-container">{children}</div>;
MockCanvasContainer.propTypes = {
  children: PropTypes.node
};

vi.mock('../components/3d-animations/CanvasContainer', () => ({
  default: MockCanvasContainer,
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
}));

const MockCanvas = ({ children }) => <div>{children}</div>;
MockCanvas.propTypes = {
  children: PropTypes.node
};

vi.mock('@react-three/fiber', () => ({
  Canvas: MockCanvas,
  useFrame: () => null,
}));

// Mock CustomTestTube
vi.mock('../components/testtube', () => ({
  default: () => <div data-testid="test-tube" />,
}));

// Mock assets
vi.mock('../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  test('displays helper text when fewer than 2 chemicals are added', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    // Button should be disabled initially
    const button = screen.getByRole('button', { name: /initiate reaction/i });
    expect(button).toBeDisabled();

    // Helper text should be present
    expect(screen.getByText(/Add at least two chemicals to initiate reaction/i)).toBeInTheDocument();
  });

  test('hides helper text when 2 or more chemicals are added', () => {
    render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );

    // Add first chemical
    const hclInput = screen.getByLabelText(/Conc. HCl/i);
    fireEvent.change(hclInput, { target: { value: '20' } });

    // Helper text should still be present (only 1 chemical)
    expect(screen.getByText(/Add at least two chemicals to initiate reaction/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /initiate reaction/i })).toBeDisabled();

    // Add second chemical
    const naclInput = screen.getByLabelText(/NaCl/i);
    fireEvent.change(naclInput, { target: { value: '20' } });

    // Helper text should disappear
    expect(screen.queryByText(/Add at least two chemicals to initiate reaction/i)).not.toBeInTheDocument();

    // Button should be enabled
    expect(screen.getByRole('button', { name: /initiate reaction/i })).toBeEnabled();
  });
});
