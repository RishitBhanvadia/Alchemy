import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Lab from '../lab';

// Mock assets
vi.mock('../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../assets/feso4.png', () => ({ default: 'feso4.png' }));
vi.mock('../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../assets/nacl.png', () => ({ default: 'nacl.png' }));

// Mock components
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn(() => ({
      revert: vi.fn()
    }))
  }
}));

// Mock React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Lab Component', () => {
  it('updates color when HCl concentration changes', async () => {
    render(<Lab />);

    // Find the HCl slider
    // The label is "Conc. HCl"
    const hclInput = screen.getByLabelText(/Conc. HCl/i);

    // Initial state: value 0, color should be transparent/empty
    // We can check the CustomTestTube by looking for the path with id "permanent"
    // However, CustomTestTube renders an SVG. Let's inspect the DOM.
    // The path with id="permanent" has a fill attribute.

    // Changing the value to 50
    fireEvent.change(hclInput, { target: { value: '50' } });

    // We expect the color to update to #05B9C4
    // But due to the bug, it might not update immediately or correctly on the first try.

    // Check if the liquid element has the correct fill color
    // We need to query by id or some other selector.
    // Since CustomTestTube renders inside Lab, we can look for the svg path.
    // Note: react-testing-library might have trouble with SVGs if not configured, but usually it renders them.

    // Let's use a data-testid or just query selector if needed.
    // The path has id="permanent".
    // Since we can't easily query by ID in RTL without setup, let's use container.querySelector

    const liquidPath = document.getElementById('permanent');
    // Actually, document.getElementById searches the whole document. JSDOM supports this.

    // Wait for any effects?
    await waitFor(() => {
        // We expect the fill to be #05B9C4
        expect(liquidPath).toHaveAttribute('fill', '#05B9C4');
    });
  });
});
