// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import CursorFollower from '../CursorFollower';

describe('CursorFollower Component', () => {
    it('should render cursor elements', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        expect(follower).toBeInTheDocument();
        expect(dot).toBeInTheDocument();
    });

    it('should update position on mouse move', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        // Initial position check (0px, 0px)
        expect(follower.style.left).toBe('0px');
        expect(follower.style.top).toBe('0px');

        // Simulate mouse move
        act(() => {
            fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
        });

        // Check if style updated.
        expect(follower.style.left).toBe('100px');
        expect(follower.style.top).toBe('200px');
        expect(dot.style.left).toBe('100px');
        expect(dot.style.top).toBe('200px');
    });

    it('should toggle hidden class on mouse enter/leave', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');

        // Mouse leave document
        act(() => {
            fireEvent.mouseLeave(document);
        });
        expect(follower.classList.contains('hidden')).toBe(true);

        // Mouse enter document
        act(() => {
            fireEvent.mouseEnter(document);
        });
        expect(follower.classList.contains('hidden')).toBe(false);
    });

    it('should toggle clicking class on mousedown/mouseup', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');

        act(() => {
            fireEvent.mouseDown(document);
        });
        expect(follower.classList.contains('clicking')).toBe(true);

        act(() => {
            fireEvent.mouseUp(document);
        });
        expect(follower.classList.contains('clicking')).toBe(false);
    });
});
