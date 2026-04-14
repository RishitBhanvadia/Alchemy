import React, { useEffect, useState } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const [position, setPosition] = useState({ x: 0, y: 0 });
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
            setPosition({ x: e.clientX, y: e.clientY });
            handleHover(e.target);
        };

        const onMouseEnter = () => setHidden(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseDown = () => setClicking(true);
        const onMouseUp = () => setClicking(false);

        const handleHover = (element) => {
            const isInteractive =
                element.tagName.toLowerCase() === 'a' ||
                element.tagName.toLowerCase() === 'button' ||
                element.closest('a') ||
                element.closest('button') ||
                element.closest('.interactive') ||
                element.classList.contains('interactive');

            setHovering(isInteractive);
        };

        addEventListeners();
        return () => removeEventListeners();
    }, []);

    if (isTouchDevice) return null;

    return (
        <div
            className={`cursor-follower ${hidden ? 'hidden' : ''} ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        />
    );
};

export default CursorFollower;
