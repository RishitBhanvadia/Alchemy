import { render, fireEvent, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CursorFollower from '../CursorFollower';

describe('CursorFollower', () => {
  it('renders correctly', () => {
    render(<CursorFollower />);
    const cursor = document.querySelector('.cursor-follower');
    expect(cursor).toBeInTheDocument();
    const dot = document.querySelector('.cursor-dot');
    expect(dot).toBeInTheDocument();
  });

  it('updates position on mouse move using transform', () => {
    render(<CursorFollower />);
    const cursor = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');

    act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    });

    // We expect transform to be used instead of left/top
    // The exact string depends on implementation: translate3d(100px, 100px, 0) translate(-50%, -50%)
    expect(cursor.style.transform).toContain('translate3d(100px, 100px, 0)');
    expect(dot.style.transform).toContain('translate3d(100px, 100px, 0)');
  });

  it('updates hovering state when over button', () => {
    render(
      <div>
        <button>Click me</button>
        <CursorFollower />
      </div>
    );
    const cursor = document.querySelector('.cursor-follower');
    const button = screen.getByText('Click me');

    act(() => {
        fireEvent.mouseMove(button, { clientX: 50, clientY: 50, bubbles: true });
    });

    expect(cursor).toHaveClass('hovering');
  });

   it('removes hovering state when leaving button', () => {
    render(
      <div>
        <button>Click me</button>
        <div data-testid="container">Container</div>
        <CursorFollower />
      </div>
    );
    const cursor = document.querySelector('.cursor-follower');
    const button = screen.getByText('Click me');
    const container = screen.getByTestId('container');

    // Hover button
    act(() => {
        fireEvent.mouseMove(button, { clientX: 50, clientY: 50, bubbles: true });
    });
    expect(cursor).toHaveClass('hovering');

    // Leave button
     act(() => {
        fireEvent.mouseMove(container, { clientX: 100, clientY: 100, bubbles: true });
    });
    expect(cursor).not.toHaveClass('hovering');
  });

  it('does not crash when mouse moves over document (no tagName)', () => {
      render(<CursorFollower />);
      // This triggered error before: TypeError: Cannot read properties of undefined (reading 'toLowerCase')
      act(() => {
          fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
      });
      // Should not throw
  });
});
