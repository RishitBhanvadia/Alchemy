import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // ⚡ Bolt: Performance Optimization
    // Replaced useState for position with useRef to prevent re-renders on every mousemove.
    // This decouples the visual update from the React render cycle, significantly reducing main thread work.
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;

            // ⚡ Bolt: Direct DOM manipulation for high-performance updates (60fps+)
            // Using translate3d forces GPU acceleration and avoids layout trashing
            // We append the existing translate(-50%, -50%) to maintain centering
            const transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;

            if (cursorRef.current) {
                cursorRef.current.style.transform = transform;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = transform;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            let isClickable = false;

            if (target && target.tagName) {
                isClickable =
                    target.tagName.toLowerCase() === 'button' ||
                    target.tagName.toLowerCase() === 'a' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    (target.classList && target.classList.contains('clickable'));
            }

            setHovering(!!isClickable);
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
