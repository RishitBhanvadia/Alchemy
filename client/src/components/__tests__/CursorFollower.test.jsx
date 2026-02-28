import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import CursorFollower from '../CursorFollower';

describe('CursorFollower', () => {
    beforeEach(() => {
        // Clear body
        document.body.innerHTML = '';
    });

    afterEach(() => {
        // Cleanup event listeners and DOM
        document.body.innerHTML = '';
    });

    it('updates cursor positions via DOM styles on mousemove', () => {
        const { container } = render(<CursorFollower />);

        // Find elements by class
        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        expect(follower).not.toBeNull();
        expect(dot).not.toBeNull();

        // Initial state
        expect(follower.style.left).toBe('0px');
        expect(follower.style.top).toBe('0px');

        // Simulate mousemove event on document
        fireEvent(document, new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 200,
        }));

        // Check updated state
        expect(follower.style.left).toBe('100px');
        expect(follower.style.top).toBe('200px');
        expect(dot.style.left).toBe('100px');
        expect(dot.style.top).toBe('200px');

        // Simulate another mousemove
        fireEvent(document, new MouseEvent('mousemove', {
            clientX: 350,
            clientY: 450,
        }));

        // Check updated state again
        expect(follower.style.left).toBe('350px');
        expect(follower.style.top).toBe('450px');
        expect(dot.style.left).toBe('350px');
        expect(dot.style.top).toBe('450px');
    });

    it('adds and removes hovering class based on interactive elements', () => {
        const { container } = render(
            <div>
                <button id="test-btn">Click me</button>
                <div id="test-div">Normal div</div>
                <CursorFollower />
            </div>
        );

        const follower = container.querySelector('.cursor-follower');
        const dot = container.querySelector('.cursor-dot');

        const btn = document.getElementById('test-btn');
        const div = document.getElementById('test-div');

        // Hover over button
        fireEvent(document, new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
        }));

        // Dispatch event directly on button to simulate target
        const btnEvent = new MouseEvent('mousemove', { bubbles: true });
        Object.defineProperty(btnEvent, 'target', { value: btn, enumerable: true });
        fireEvent(document, btnEvent);

        expect(follower.className).toContain('hovering');
        expect(dot.className).toContain('hovering');

        // Hover over normal div
        const divEvent = new MouseEvent('mousemove', { bubbles: true });
        Object.defineProperty(divEvent, 'target', { value: div, enumerable: true });
        fireEvent(document, divEvent);

        expect(follower.className).not.toContain('hovering');
        expect(dot.className).not.toContain('hovering');
    });
});
