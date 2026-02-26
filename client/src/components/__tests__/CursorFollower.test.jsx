import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CursorFollower from '../CursorFollower';
import { vi } from 'vitest';

describe('CursorFollower', () => {
    it('renders the cursor elements', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');
        expect(follower).toBeInTheDocument();
        expect(dot).toBeInTheDocument();
    });

    it('updates cursor position on mouse move', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        // Move mouse to (100, 100) on body to ensure e.target is an element
        fireEvent.mouseMove(document.body, { clientX: 100, clientY: 100 });

        // We check if the style has been updated.
        // In the optimized version, we use transform: translate3d.

        const hasPosition = (element, x, y) => {
             const style = element.style;
             // Ensure we are NOT using left/top for positioning anymore (performance check)
             // Allow '0', '0px', or empty string (if not set)
             if (style.left && style.left !== '0px' && style.left !== '0') return false;
             if (style.top && style.top !== '0px' && style.top !== '0') return false;

             // Check transform
             // Expected format: translate3d(100px, 100px, 0px) ...
             if (style.transform && style.transform.includes(`translate3d(${x}px, ${y}px, 0)`)) return true;

             return false;
        };

        expect(hasPosition(follower, 100, 100)).toBe(true);
        expect(hasPosition(dot, 100, 100)).toBe(true);
    });

    it('adds hovering class when hovering over a button', async () => {
        const { container } = render(
            <div>
                <CursorFollower />
                <button>Click me</button>
            </div>
        );

        const button = container.querySelector('button');
        const follower = container.querySelector('.cursor-follower');

        // Move mouse over button
        fireEvent.mouseMove(button, { clientX: 50, clientY: 50, bubbles: true });

        // Wait for re-render
        await waitFor(() => {
             expect(follower).toHaveClass('hovering');
        });
    });
});
