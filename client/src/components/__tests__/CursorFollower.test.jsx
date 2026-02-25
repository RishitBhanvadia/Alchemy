import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CursorFollower from '../CursorFollower';
import React from 'react';

// Mock requestAnimationFrame to execute immediately if used
global.requestAnimationFrame = (callback) => callback();

describe('CursorFollower', () => {
    it('renders cursor elements', () => {
        const { container } = render(<CursorFollower />);
        expect(container.querySelector('.cursor-follower')).toBeInTheDocument();
        expect(container.querySelector('.cursor-dot')).toBeInTheDocument();
    });

    it('updates position on mouse move using transform', () => {
        const { container } = render(<CursorFollower />);
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        // Simulate mouse move
        fireEvent.mouseMove(document.body, { clientX: 100, clientY: 200 });

        // Check if transform is updated
        expect(follower.style.transform).toContain('translate3d(100px, 200px, 0)');
        expect(dot.style.transform).toContain('translate3d(100px, 200px, 0)');
    });
});
