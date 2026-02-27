import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // Removed state for position to avoid re-renders on every mouse move
    const followerRef = useRef(null);
    const dotRef = useRef(null);

    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            // Direct DOM manipulation for performance
            const x = e.clientX;
            const y = e.clientY;

            if (followerRef.current) {
                followerRef.current.style.left = `${x}px`;
                followerRef.current.style.top = `${y}px`;
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${x}px`;
                dotRef.current.style.top = `${y}px`;
            }

            // Check if hovering over clickable elements
            const target = e.target;

            // Safety check for target
            if (!target || !target.tagName) return;

            try {
                const tagName = target.tagName.toLowerCase();
                const isClickable =
                    tagName === 'button' ||
                    tagName === 'a' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    target.classList.contains('clickable');

                setHovering(!!isClickable);
            } catch (err) {
                // Ignore errors on non-standard elements
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
                ref={followerRef}
                className={cursorClasses}
                // Initial position off-screen or 0,0
                style={{ left: '0px', top: '0px' }}
            />
            <div
                ref={dotRef}
                className={dotClasses}
                style={{ left: '0px', top: '0px' }}
            />
        </>
    );
};

export default CursorFollower;
