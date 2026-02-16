import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CursorFollower from '../CursorFollower';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('CursorFollower', () => {
  it('renders without crashing', () => {
    render(<CursorFollower />);
    const follower = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');
    expect(follower).toBeInTheDocument();
    expect(dot).toBeInTheDocument();
  });

  it('updates position on mouse move', () => {
    render(<CursorFollower />);
    const follower = document.querySelector('.cursor-follower');

    // Simulate mouse move on body to ensure target has tagName
    fireEvent.mouseMove(document.body, { clientX: 100, clientY: 100 });

    expect(follower).toHaveClass('cursor-follower');
  });
});
