import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab from '../lab';

// Mock dependencies
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn((cb) => cb()),
    registerPlugin: vi.fn(),
  }
}));

vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

vi.mock('../../components/testtube', () => ({
  default: ({ color, hasLiquid }) => <div data-testid="test-tube" data-color={color} data-liquid={hasLiquid ? 'true' : 'false'} />
}));

// Mock images
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  const renderLab = () => {
    return render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );
  };

  it('should update test tube color immediately when chemical amount changes', async () => {
    renderLab();

    // Initial state: color should be empty
    const testTube = screen.getByTestId('test-tube');
    expect(testTube).toHaveAttribute('data-color', '');

    // Find the HCl slider
    const hclSlider = screen.getByLabelText(/Conc. HCl/i);
    expect(hclSlider).toBeInTheDocument();

    // Change HCl value to 50
    fireEvent.change(hclSlider, { target: { value: '50' } });

    // Wait for update (even though the bug is synchronous logic error,
    // React state update is async, so we use waitFor just in case,
    // but the bug means it WON'T update correctly even after re-render)

    // With the bug: state update happens, but change_tip used old state (0).
    // So color remains empty.

    // We expect this to be #05B9C4 if logic was correct.
    // The test will fail if the bug exists.
    await waitFor(() => {
        expect(testTube).toHaveAttribute('data-color', '#05B9C4');
    });
  });
});
