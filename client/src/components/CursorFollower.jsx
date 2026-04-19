import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

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
            if (cursorRef.current && dotRef.current) {
                const x = `${e.clientX}px`;
                const y = `${e.clientY}px`;

                cursorRef.current.style.left = x;
                cursorRef.current.style.top = y;
                dotRef.current.style.left = x;
                dotRef.current.style.top = y;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable = target && (
                (target.tagName && (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a')) ||
                (target.closest && (target.closest('button') || target.closest('a'))) ||
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
            <div ref={cursorRef} className="cursor-follower" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
};

export default CursorFollower;
