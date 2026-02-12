import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Lab from './lab';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks
jest.mock('gsap', () => ({
  gsap: {
    context: jest.fn(() => ({ revert: jest.fn() })),
    fromTo: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../components/3d-animations/CanvasContainer', () => ({ children }) => (
  <div data-testid="canvas-container">{children}</div>
));

jest.mock('../components/testtube', () => ({ color, hasLiquid }) => (
  <div
    data-testid="custom-test-tube"
    data-color={color || ''}
    data-hasliquid={hasLiquid ? 'true' : 'false'}
  />
));

// Mock assets
jest.mock('../assets/hcl.png', () => 'hcl.png');
jest.mock('../assets/feso4.png', () => 'feso4.png');
jest.mock('../assets/cuso4.png', () => 'cuso4.png');
jest.mock('../assets/nacl.png', () => 'nacl.png');

describe('Lab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly and updates tip color based on chemical inputs', () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    const testTube = screen.getByTestId('custom-test-tube');
    // Using getByLabelText now that we fixed accessibility
    const chemAInput = screen.getByLabelText(/Conc. HCl/i);
    const chemBInput = screen.getByLabelText(/NaCl/i);
    // const chemCInput = screen.getByLabelText(/CuSO4/i);
    // const chemDInput = screen.getByLabelText(/FeSO4/i);

    // Initial state: no color
    expect(testTube).toHaveAttribute('data-color', '');

    // Change ChemA (HCl) -> Should set color #05B9C4
    fireEvent.change(chemAInput, { target: { value: '10' } });

    // Check if color updated.
    // This assertion verifies the logic fix (useEffect).
    expect(testTube).toHaveAttribute('data-color', '#05B9C4');

    // Reset ChemA
    fireEvent.change(chemAInput, { target: { value: '0' } });
    expect(testTube).toHaveAttribute('data-color', '');

    // Change ChemB (NaCl) -> #04CE7E
    fireEvent.change(chemBInput, { target: { value: '20' } });
    expect(testTube).toHaveAttribute('data-color', '#04CE7E');

    // Priority Check: ChemA > ChemB
    fireEvent.change(chemAInput, { target: { value: '10' } });
    expect(testTube).toHaveAttribute('data-color', '#05B9C4');

    // Remove ChemA -> Back to ChemB color
    fireEvent.change(chemAInput, { target: { value: '0' } });
    expect(testTube).toHaveAttribute('data-color', '#04CE7E');
  });
});
