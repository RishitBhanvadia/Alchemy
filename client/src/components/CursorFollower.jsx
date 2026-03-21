import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

// ⚡ Bolt: Optimize cursor follower to prevent excessive React re-renders.
// The component tracks coordinates via mousemove (60+ times per second).
// Using useState for coordinates causes React to re-render the entire component
// on every frame. We optimize this by maintaining refs to the DOM nodes and
// applying positioning directly to avoid React's render lifecycle.
const CursorFollower = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            // Apply coordinates directly to the DOM nodes using left/top
            // instead of triggering a React re-render with state. This avoids
            // overwriting any CSS transform properties used for centering.
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

            // Check if hovering over clickable elements safely
            const target = e.target;
            const isClickable =
                target?.tagName?.toLowerCase() === 'button' ||
                target?.tagName?.toLowerCase() === 'a' ||
                target?.closest?.('button') ||
                target?.closest?.('a') ||
                target?.classList?.contains('clickable');

            setHovering(!!isClickable);
        };

        const onMouseEnter = () => setHidden(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseDown = () => setClicking(true);
        const onMouseUp = () => setClicking(false);

        addEventListeners();
        return () => removeEventListeners();
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
