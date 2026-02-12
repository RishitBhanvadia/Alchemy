import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Lab from './lab';

// Mock react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

// Mock gsap
// We need to ensure context returns an object with revert
const mockRevert = jest.fn();
jest.mock('gsap', () => ({
  gsap: {
    context: jest.fn(() => ({
      revert: mockRevert,
    })),
    fromTo: jest.fn(),
  },
}));

// Mock assets
jest.mock('../assets/hcl.png', () => 'hcl.png');
jest.mock('../assets/feso4.png', () => 'feso4.png');
jest.mock('../assets/cuso4.png', () => 'cuso4.png');
jest.mock('../assets/nacl.png', () => 'nacl.png');

// Mock CustomTestTube component
jest.mock('../components/testtube', () => {
  return function DummyTestTube({ color, hasLiquid }) {
    return <div data-testid="custom-test-tube" data-color={color} data-hasliquid={hasLiquid.toString()}>TestTube</div>;
  };
});

describe('Lab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Lab component correctly', () => {
    render(<Lab />);
    expect(screen.getByText('CHEMICAL RACK')).toBeInTheDocument();
    expect(screen.getByText('INITIATE REACTION')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });

  test('button is disabled initially', () => {
    render(<Lab />);
    const button = screen.getByText('INITIATE REACTION').closest('button');
    expect(button).toBeDisabled();
  });

  test('button enables when two chemicals are selected', () => {
    render(<Lab />);
    const hclInput = screen.getByLabelText('Conc. HCl');
    const naclInput = screen.getByLabelText('NaCl');

    // Select first chemical
    fireEvent.change(hclInput, { target: { value: '20' } });

    // Button still disabled (only 1)
    const button = screen.getByText('INITIATE REACTION').closest('button');
    expect(button).toBeDisabled();

    // Select second chemical
    fireEvent.change(naclInput, { target: { value: '20' } });

    // Button should be enabled
    expect(button).not.toBeDisabled();
  });

  test('clicking button shows processing state and navigates', async () => {
    render(<Lab />);
    const hclInput = screen.getByLabelText('Conc. HCl');
    const naclInput = screen.getByLabelText('NaCl');

    fireEvent.change(hclInput, { target: { value: '20' } });
    fireEvent.change(naclInput, { target: { value: '20' } });

    const button = screen.getByText('INITIATE REACTION').closest('button');
    fireEvent.click(button);

    // Check for processing state
    expect(screen.getByText('PROCESSING...')).toBeInTheDocument();

    // Check for spinner class
    expect(screen.getByText('PROCESSING...').querySelector('.spinner')).toBeInTheDocument();

    // Wait for navigation
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/result', expect.objectContaining({
        replace: true,
        state: expect.objectContaining({
            chemA: 20,
            chemB: 20
        })
      }));
    }, { timeout: 2000 });
  });
});
