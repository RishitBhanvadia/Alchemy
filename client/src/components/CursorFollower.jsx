import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    // Use refs for direct DOM manipulation to avoid re-renders on mouse move
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const requestRef = useRef(null);

    useEffect(() => {
        // Animation loop to update position smoothly
        const animate = () => {
            if (cursorRef.current && dotRef.current) {
                const { x, y } = positionRef.current;
                // Combine translate3d for performance with translate(-50%, -50%) for centering
                const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                cursorRef.current.style.transform = transform;
                dotRef.current.style.transform = transform;
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            // Update position ref without triggering re-render
            positionRef.current = { x: e.clientX, y: e.clientY };

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable');

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
                // Initial style to ensure it starts at 0,0 (or match CSS default)
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
