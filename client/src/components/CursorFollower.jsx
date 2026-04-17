import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    // We only need state for things that actually change the structure or need to trigger re-renders,
    // but in this case, all visual updates can be handled via direct DOM manipulation to save performance.
    // However, to keep it simple, we will completely replace state with ref updates.

    useEffect(() => {
        if (isTouchDevice) return; // Prevent attaching listeners on touch devices

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
                // Direct DOM manipulation bypasses React render cycle
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
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

            if (cursorRef.current && dotRef.current) {
                if (isClickable) {
                    cursorRef.current.classList.add('hovering');
                    dotRef.current.classList.add('hovering');
                } else {
                    cursorRef.current.classList.remove('hovering');
                    dotRef.current.classList.remove('hovering');
                }
            }
        };

        const onMouseEnter = () => {
            if (cursorRef.current && dotRef.current) {
                cursorRef.current.classList.remove('hidden');
                dotRef.current.classList.remove('hidden');
            }
        };

        const onMouseLeave = () => {
            if (cursorRef.current && dotRef.current) {
                cursorRef.current.classList.add('hidden');
                dotRef.current.classList.add('hidden');
            }
        };

        const onMouseDown = () => {
            if (cursorRef.current) {
                cursorRef.current.classList.add('clicking');
            }
        };

        const onMouseUp = () => {
            if (cursorRef.current) {
                cursorRef.current.classList.remove('clicking');
            }
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