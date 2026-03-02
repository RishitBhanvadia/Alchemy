import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import CursorFollower from '../CursorFollower';

describe('CursorFollower', () => {
  beforeEach(() => {
    // Render before each test
    render(
      <div>
        <button id="btn">Click me</button>
        <CursorFollower />
      </div>
    );
  });

  afterEach(() => {
    // Clean up
  });

  it('updates style.left and style.top on mousemove using refs', () => {
    const cursor = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');

    expect(cursor).toBeInTheDocument();
    expect(dot).toBeInTheDocument();

    // Fire mousemove event on the document, providing a mock target so it doesn't crash
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200, target: document.body });

    expect(cursor.style.left).toBe('100px');
    expect(cursor.style.top).toBe('200px');
    expect(dot.style.left).toBe('100px');
    expect(dot.style.top).toBe('200px');
  });

  it('adds hovering class on clickable elements', () => {
    const cursor = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');
    const btn = document.querySelector('#btn');

    // Fire mousemove directly on the button to simulate hovering over it
    fireEvent.mouseMove(btn, { clientX: 0, clientY: 0 });

    expect(cursor.classList.contains('hovering')).toBe(true);
    expect(dot.classList.contains('hovering')).toBe(true);

    // Move away
    fireEvent.mouseMove(document.body, { clientX: 100, clientY: 100 });

    expect(cursor.classList.contains('hovering')).toBe(false);
    expect(dot.classList.contains('hovering')).toBe(false);
  });

  it('adds and removes hidden class on mouseenter and mouseleave', () => {
    const cursor = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');

    fireEvent.mouseLeave(document);
    expect(cursor.classList.contains('hidden')).toBe(true);
    expect(dot.classList.contains('hidden')).toBe(true);

    fireEvent.mouseEnter(document);
    expect(cursor.classList.contains('hidden')).toBe(false);
    expect(dot.classList.contains('hidden')).toBe(false);
  });

  it('adds clicking class on mousedown', () => {
    const cursor = document.querySelector('.cursor-follower');

    fireEvent.mouseDown(document);
    expect(cursor.classList.contains('clicking')).toBe(true);

    fireEvent.mouseUp(document);
    expect(cursor.classList.contains('clicking')).toBe(false);
  });
});
