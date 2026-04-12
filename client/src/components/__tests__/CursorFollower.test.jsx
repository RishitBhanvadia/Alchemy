import React from 'react';
import { render } from '@testing-library/react';
import CursorFollower from '../CursorFollower';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('CursorFollower Component', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders correctly on non-touch devices without crashing', () => {
    const { container } = render(<CursorFollower />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('returns null on touch devices without throwing hook errors', () => {
    // Override matchMedia to simulate a touch device
    window.matchMedia.mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<CursorFollower />);
    expect(container.firstChild).toBeNull();
  });
});
