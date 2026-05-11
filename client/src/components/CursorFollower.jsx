import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const followerRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice) return;

        const follower = followerRef.current;
        const dot = dotRef.current;

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
            if (follower && dot) {
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
                dot.style.left = `${e.clientX}px`;
                dot.style.top = `${e.clientY}px`;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable');

            if (follower && dot) {
                if (isClickable) {
                    follower.classList.add('hovering');
                    dot.classList.add('hovering');
                } else {
                    follower.classList.remove('hovering');
                    dot.classList.remove('hovering');
                }
            }
        };

        const onMouseEnter = () => {
            if (follower && dot) {
                follower.classList.remove('hidden');
                dot.classList.remove('hidden');
            }
        };

        const onMouseLeave = () => {
            if (follower && dot) {
                follower.classList.add('hidden');
                dot.classList.add('hidden');
            }
        };

        const onMouseDown = () => {
            if (follower) {
                follower.classList.add('clicking');
            }
        };

        const onMouseUp = () => {
            if (follower) {
                follower.classList.remove('clicking');
            }
        };

        addEventListeners();
        return () => removeEventListeners();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            <div
                ref={followerRef}
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
