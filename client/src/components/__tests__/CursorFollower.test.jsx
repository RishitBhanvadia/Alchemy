import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CursorFollower from '../CursorFollower';

describe('CursorFollower Component', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // Deprecated
                removeListener: vi.fn(), // Deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('renders cursor elements on non-touch devices', () => {
        const { container } = render(<CursorFollower />);
        expect(container.querySelector('.cursor-follower')).not.toBeNull();
        expect(container.querySelector('.cursor-dot')).not.toBeNull();
    });

    it('returns null on touch devices without hook errors', () => {
        window.matchMedia = vi.fn().mockImplementation(() => ({
            matches: true,
        }));
        const { container } = render(<CursorFollower />);
        expect(container.querySelector('.cursor-follower')).toBeNull();
    });
});
