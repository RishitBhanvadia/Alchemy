import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    // Optimization: Use useRef instead of useState to prevent triggering React
    // re-renders 60+ times per second on mousemove events.
    const followerRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice) return;

        const follower = followerRef.current;
        const dot = dotRef.current;

        if (!follower || !dot) return;

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
            follower.style.left = `${e.clientX}px`;
            follower.style.top = `${e.clientY}px`;
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable');

            if (isClickable) {
                follower.classList.add('hovering');
                dot.classList.add('hovering');
            } else {
                follower.classList.remove('hovering');
                dot.classList.remove('hovering');
            }
        };

        const onMouseEnter = () => {
            follower.classList.remove('hidden');
            dot.classList.remove('hidden');
        };

        const onMouseLeave = () => {
            follower.classList.add('hidden');
            dot.classList.add('hidden');
        };

        const onMouseDown = () => {
            follower.classList.add('clicking');
        };

        const onMouseUp = () => {
            follower.classList.remove('clicking');
        };

        addEventListeners();
        return () => removeEventListeners();
    }, []);

    if (isTouchDevice) return null;

    return (
        <>
            <div ref={followerRef} className="cursor-follower" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
};

export default CursorFollower;
