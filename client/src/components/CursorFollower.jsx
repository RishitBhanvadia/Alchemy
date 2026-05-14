import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const followerRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice) return;

        const onMouseMove = (e) => {
            // Update positions directly via refs to avoid React state re-renders (Performance optimization)
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
            const isClickable =
                target.tagName?.toLowerCase() === 'button' ||
                target.tagName?.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList?.contains('clickable');

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

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };
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
