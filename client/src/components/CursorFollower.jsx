import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const followerRef = useRef(null);
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
            if (followerRef.current) {
                followerRef.current.style.left = `${e.clientX}px`;
                followerRef.current.style.top = `${e.clientY}px`;
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable = target && target.tagName ? (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                (target.classList && target.classList.contains('clickable'))
            ) : false;

            if (isClickable) {
                followerRef.current?.classList.add('hovering');
                dotRef.current?.classList.add('hovering');
            } else {
                followerRef.current?.classList.remove('hovering');
                dotRef.current?.classList.remove('hovering');
            }
        };

        const onMouseEnter = () => {
            followerRef.current?.classList.remove('hidden');
            dotRef.current?.classList.remove('hidden');
        };

        const onMouseLeave = () => {
            followerRef.current?.classList.add('hidden');
            dotRef.current?.classList.add('hidden');
        };

        const onMouseDown = () => {
            followerRef.current?.classList.add('clicking');
        };

        const onMouseUp = () => {
            followerRef.current?.classList.remove('clicking');
        };

        addEventListeners();
        return () => removeEventListeners();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            <div ref={followerRef} className="cursor-follower" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
};

export default CursorFollower;
