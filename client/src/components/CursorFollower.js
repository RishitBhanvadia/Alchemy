import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // Refs for direct DOM manipulation (Performance optimization: avoids re-renders on mousemove)
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;
            // Use translate3d for GPU acceleration
            const transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;

            if (cursorRef.current) {
                cursorRef.current.style.transform = transform;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = transform;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            // Safe check for tagName as target could be document
            const tagName = target.tagName ? target.tagName.toLowerCase() : '';

            const isClickable =
                tagName === 'button' ||
                tagName === 'a' ||
                (target.closest && (target.closest('button') || target.closest('a'))) ||
                (target.classList && target.classList.contains('clickable'));

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
                style={{ left: 0, top: 0 }}
            />
            <div
                ref={dotRef}
                className={dotClasses}
                style={{ left: 0, top: 0 }}
            />
        </>
    );
};

export default CursorFollower;
