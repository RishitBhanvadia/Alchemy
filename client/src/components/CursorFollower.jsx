import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    if (isTouchDevice) return null;

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

            if (isClickable) {
                cursorRef.current?.classList.add('hovering');
                dotRef.current?.classList.add('hovering');
            } else {
                cursorRef.current?.classList.remove('hovering');
                dotRef.current?.classList.remove('hovering');
            }
        };

        const onMouseEnter = () => {
            cursorRef.current?.classList.remove('hidden');
            dotRef.current?.classList.remove('hidden');
        };

        const onMouseLeave = () => {
            cursorRef.current?.classList.add('hidden');
            dotRef.current?.classList.add('hidden');
        };

        const onMouseDown = () => {
            cursorRef.current?.classList.add('clicking');
        };

        const onMouseUp = () => {
            cursorRef.current?.classList.remove('clicking');
        };

        addEventListeners();
        return () => removeEventListeners();
    }, []);

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
