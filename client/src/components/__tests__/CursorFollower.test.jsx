import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CursorFollower from '../CursorFollower';

// Mock getComputedStyle since jsdom doesn't fully support it for some properties
// or just rely on style prop checks
window.getComputedStyle = vi.fn().mockImplementation(() => ({
    getPropertyValue: () => '',
}));

describe('CursorFollower', () => {
    it('renders cursor elements', () => {
        const { container } = render(<CursorFollower />);
        const cursor = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');
        expect(cursor).toBeInTheDocument();
        expect(dot).toBeInTheDocument();
    });

    it('updates cursor position on mouse move', () => {
        const { container } = render(<CursorFollower />);
        const cursor = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        // Simulate mouse move on document.body
        fireEvent.mouseMove(document.body, { clientX: 100, clientY: 200 });

        // Optimized implementation uses transform
        expect(cursor.style.transform).toContain('translate3d(100px, 200px, 0)');
        expect(dot.style.transform).toContain('translate3d(100px, 200px, 0)');
    });

    it('does not crash when target has no tagName (e.g. document)', () => {
        const { container } = render(<CursorFollower />);

        // This would crash in the old implementation
        // Simulate mouse move directly on document
        fireEvent.mouseMove(document, { clientX: 150, clientY: 250 });

        const cursor = container.querySelector('.cursor-follower');
        // Should still update position
        expect(cursor.style.transform).toContain('translate3d(150px, 250px, 0)');
    });

    it('adds hovering class when hovering over a button', () => {
        const { container } = render(
            <div>
                <button>Click me</button>
                <CursorFollower />
            </div>
        );
        const cursor = container.querySelector('.cursor-follower');
        const button = screen.getByText('Click me');

        fireEvent.mouseMove(button, { clientX: 50, clientY: 50, bubbles: true });

        expect(cursor).toHaveClass('hovering');
    });
});
