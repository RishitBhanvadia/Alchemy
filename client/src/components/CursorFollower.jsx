import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
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
            if (cursorRef.current && dotRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

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

        addEventListeners();
        return () => removeEventListeners();
    }, []);

    const cursorClasses = `cursor-follower ${hidden ? 'hidden' : ''} ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`;
    const dotClasses = `cursor-dot ${hidden ? 'hidden' : ''} ${hovering ? 'hovering' : ''}`;

    if (isTouchDevice) return null;

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
