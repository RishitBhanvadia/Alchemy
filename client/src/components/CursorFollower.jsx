import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

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
            // Optimization: Directly update DOM style transform for better performance
            // Uses translate3d for GPU acceleration and avoids layout thrashing from top/left updates
            const x = e.clientX;
            const y = e.clientY;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            // Optimization: Safety check for tagName existence
            if (target && target.tagName) {
                const isClickable =
                    target.tagName.toLowerCase() === 'button' ||
                    target.tagName.toLowerCase() === 'a' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    target.classList.contains('clickable');

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
