import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lab from '../lab';
import { MemoryRouter } from 'react-router-dom';

// Mock child components
vi.mock('../../components/testtube', () => ({
  default: ({ color }) => <div data-testid="custom-test-tube" data-color={color}>TestTube</div>
}));

vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
  }
}));

// Mock assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));

describe('Lab Component', () => {
  it('updates test tube color correctly when chemicals are added', async () => {
    render(
      <MemoryRouter>
        <Lab />
      </MemoryRouter>
    );

    // Initial state: No color
    const testTube = screen.getByTestId('custom-test-tube');
    expect(testTube).toHaveAttribute('data-color', '');

    // Find the HCl input (first slider)
    // Since inputs don't have IDs yet, we rely on the DOM structure
    const hclLabel = screen.getByText('Conc. HCl');
    // The input is a sibling inside the .range-wrapper div
    // But testing-library is strict. Let's try to find by display value if possible, or just traverse.
    // In the component:
    // <div className="range-wrapper">
    //   <label>Conc. HCl</label>
    //   <input ... />

    // So nextElementSibling should work if they are direct siblings.
    const hclInput = hclLabel.nextElementSibling;

    expect(hclInput).toBeInTheDocument();
    expect(hclInput.tagName).toBe('INPUT');

    // Simulate user dragging slider to value 10
    fireEvent.change(hclInput, { target: { value: '10' } });

    // Verify the value updated (state updated via re-render)
    expect(hclInput.value).toBe('10');

    // Now verify the color. This assertion should fail if the bug exists (stale state in change_tip).
    // The correct behavior is that color updates immediately to '#05B9C4'.
    expect(testTube).toHaveAttribute('data-color', '#05B9C4');
  });
});
