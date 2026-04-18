import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Use refs instead of state to bypass React render cycle on mouse events
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice) return;

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
            // Directly update DOM position bypassing render
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
            const isClickable = target && (
                (target.tagName && target.tagName.toLowerCase() === 'button') ||
                (target.tagName && target.tagName.toLowerCase() === 'a') ||
                (target.closest && target.closest('button')) ||
                (target.closest && target.closest('a')) ||
                (target.classList && target.classList.contains('clickable'))
            );

            // Directly update classes
            if (cursorRef.current) {
                cursorRef.current.classList.toggle('hovering', !!isClickable);
            }
            if (dotRef.current) {
                dotRef.current.classList.toggle('hovering', !!isClickable);
            }
        };

        const onMouseEnter = () => {
            if (cursorRef.current) cursorRef.current.classList.remove('hidden');
            if (dotRef.current) dotRef.current.classList.remove('hidden');
        };

        const onMouseLeave = () => {
            if (cursorRef.current) cursorRef.current.classList.add('hidden');
            if (dotRef.current) dotRef.current.classList.add('hidden');
        };

        const onMouseDown = () => {
            if (cursorRef.current) cursorRef.current.classList.add('clicking');
        };

        const onMouseUp = () => {
            if (cursorRef.current) cursorRef.current.classList.remove('clicking');
        };

        addEventListeners();
        return () => removeEventListeners();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="cursor-follower"
            />
            <div
                ref={dotRef}
                className="cursor-dot"
            />
        </>
    );
};

export default CursorFollower;
