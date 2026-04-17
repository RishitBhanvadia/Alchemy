import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CursorFollower from './CursorFollower';

describe('CursorFollower', () => {
    let matchMediaMock;

    beforeEach(() => {
        matchMediaMock = vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: matchMediaMock,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders and follows cursor', () => {
        const { container } = render(<CursorFollower />);

        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        expect(follower).toBeInTheDocument();
        expect(dot).toBeInTheDocument();

        act(() => {
            fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
        });

        expect(follower.style.left).toBe('100px');
        expect(follower.style.top).toBe('200px');
    });

    it('returns null on touch devices without violating rules of hooks', () => {
        matchMediaMock.mockImplementation(() => ({
            matches: true,
        }));

        const { container } = render(<CursorFollower />);
        expect(container.firstChild).toBeNull();
    });
});
