import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CursorFollower from './CursorFollower';

describe('CursorFollower', () => {
  test('renders cursor elements', () => {
    const { container } = render(<CursorFollower />);
    const follower = container.querySelector('.cursor-follower');
    const dot = container.querySelector('.cursor-dot');
    expect(follower).toBeInTheDocument();
    expect(dot).toBeInTheDocument();
  });

  test('updates position on mouse move', () => {
    const { container } = render(<CursorFollower />);
    const follower = container.querySelector('.cursor-follower');

    // Initial position is 0,0
    expect(follower).toHaveStyle('left: 0px');
    expect(follower).toHaveStyle('top: 0px');

    // Move mouse
    fireEvent.mouseMove(document.body, { clientX: 100, clientY: 200 });

    // Check update
    // The component now uses transform for performance
    expect(follower).toHaveStyle('transform: translate3d(100px, 200px, 0) translate(-50%, -50%)');
  });

  test('adds hovering class when hovering over clickable element', () => {
    const { container } = render(
      <div>
        <CursorFollower />
        <button>Click Me</button>
      </div>
    );
    const follower = container.querySelector('.cursor-follower');
    const button = screen.getByText('Click Me');

    // Move mouse over button
    fireEvent.mouseMove(button, { clientX: 50, clientY: 50, bubbles: true });

    expect(follower).toHaveClass('hovering');

    // Move away to document body
    fireEvent.mouseMove(document.body, { clientX: 0, clientY: 0 });
    expect(follower).not.toHaveClass('hovering');
  });
});
