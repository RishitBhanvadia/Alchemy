import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import custom matchers like toBeInTheDocument
import CursorFollower from './CursorFollower';

test('renders CursorFollower without crashing', () => {
  render(<CursorFollower />);
  const cursor = document.querySelector('.cursor-follower');
  const dot = document.querySelector('.cursor-dot');
  expect(cursor).toBeInTheDocument();
  expect(dot).toBeInTheDocument();
});

test('updates transform on mouse move', () => {
  render(<CursorFollower />);
  const cursor = document.querySelector('.cursor-follower');
  const dot = document.querySelector('.cursor-dot');

  // Simulate mouse move
  // Fire on body to ensure target is an element, though document is also handled now.
  fireEvent.mouseMove(document.body, { clientX: 100, clientY: 100 });

  // Check if transform style is updated
  // The exact string depends on implementation:
  // `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
  // Note that 0 usually becomes 0px in some contexts, but here it's a string template.
  // The test output showed: "translate3d(100px, 100px, 0) translate(-50%, -50%)"

  const expectedTransform = 'translate3d(100px, 100px, 0) translate(-50%, -50%)';

  // We check if it *contains* the coordinate part at least.
  expect(cursor.style.transform).toContain('translate3d(100px, 100px, 0)');
  expect(dot.style.transform).toContain('translate3d(100px, 100px, 0)');
});
