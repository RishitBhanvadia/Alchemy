import React, { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    // Remove state-based position to avoid re-rendering on every mousemove
    // const [position, setPosition] = useState({ x: 0, y: 0 });
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
            // Directly manipulate the DOM for performance instead of setting state
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

            // Check if hovering over clickable elements
            const target = e.target;
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
                // Initial styles only, updated via ref
                style={{ left: '0px', top: '0px' }}
            />
            <div
                ref={dotRef}
                className={dotClasses}
                // Initial styles only, updated via ref
                style={{ left: '0px', top: '0px' }}
            />
        </>
    );
};

export default CursorFollower;
