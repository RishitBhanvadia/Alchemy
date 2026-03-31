import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

/**
 * Optimized CursorFollower component.
 *
 * Performance improvements:
 * 1. Replaced useState with useRef for cursor position tracking to eliminate re-renders on every mousemove event.
 * 2. Uses direct DOM manipulation via 'transform: translate3d' for hardware-accelerated movement.
 * 3. Updates are performed inside the event listener without triggering React's reconciliation cycle.
 *
 * Expected Impact:
 * - Reduces main thread blocking time during mouse movement.
 * - Eliminates thousands of unnecessary React renders per session.
 * - Smoother cursor animation (60fps) even during heavy react updates.
 */
const CursorFollower = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    // Only use state for visual modes that change infrequently
    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;

            // OPTIMIZATION: Update DOM directly to bypass React render cycle
            // Using translate3d forces GPU acceleration
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
            }

            // Check if hovering over clickable elements
            // We do this check here to update the hovering state
            const target = e.target;
            if (target && (target.tagName || target.classList)) {
                const isClickable =
                    target.tagName.toLowerCase() === 'button' ||
                    target.tagName.toLowerCase() === 'a' ||
                    (target.closest && (target.closest('button') || target.closest('a'))) ||
                    (target.classList && target.classList.contains('clickable'));

                // Only trigger re-render if state actually changes
                setHovering((prev) => (!!isClickable !== prev ? !!isClickable : prev));
            } else {
                setHovering((prev) => (prev !== false ? false : prev));
            }
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseDown = () => {
            setClicking(true);
        };

        const onMouseUp = () => {
            setClicking(false);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const cursorClasses = `cursor-follower ${hidden ? 'hidden' : ''} ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`;
    const dotClasses = `cursor-dot ${hidden ? 'hidden' : ''} ${hovering ? 'hovering' : ''}`;

    return (
        <>
            <div
                ref={cursorRef}
                className={cursorClasses}
            />
            <div
                ref={dotRef}
                className={dotClasses}
            />
        </>
    );
};

export default CursorFollower;
