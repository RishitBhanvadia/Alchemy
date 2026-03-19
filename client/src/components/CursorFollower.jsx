import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // Replace position state with refs to avoid re-renders on every mouse move
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
            // Directly mutate style to avoid excessive re-renders and use transform for better performance
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }

            // Check if hovering over clickable elements safely using optional chaining
            const target = e.target;
            const isClickable =
                target?.tagName?.toLowerCase() === 'button' ||
                target?.tagName?.toLowerCase() === 'a' ||
                target?.closest?.('button') ||
                target?.closest?.('a') ||
                target?.classList?.contains('clickable');

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
                style={{ transform: `translate(0px, 0px)` }}
            />
            <div
                ref={dotRef}
                className={dotClasses}
                style={{ transform: `translate(0px, 0px)` }}
            />
        </>
    );
};

export default CursorFollower;
