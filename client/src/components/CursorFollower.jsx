import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // Optimization: Use useRef for direct DOM manipulation to avoid re-renders on every mouse move
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
            // Direct DOM manipulation for performance
            // Using translate3d triggers GPU acceleration and avoids layout trashing
            const x = e.clientX;
            const y = e.clientY;

            // Apply transform to both cursor elements
            // We must append translate(-50%, -50%) to maintain the centering defined in CSS,
            // as setting style.transform overrides the CSS class transform.
            const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

            if (cursorRef.current) {
                cursorRef.current.style.transform = transform;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = transform;
            }

            // Check if hovering over clickable elements
            const target = e.target;

            // Safety check: verify target and tagName exist before accessing properties
            if (target && target.tagName) {
                const isClickable =
                    target.tagName.toLowerCase() === 'button' ||
                    target.tagName.toLowerCase() === 'a' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    (target.classList && target.classList.contains('clickable'));

                setHovering(!!isClickable);
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
