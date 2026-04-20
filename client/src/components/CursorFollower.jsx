import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const stateRef = useRef({
        hidden: false,
        clicking: false,
        hovering: false
    });

    useEffect(() => {
        if (isTouchDevice) return;

        const updateClasses = () => {
            if (cursorRef.current && dotRef.current) {
                const { hidden, clicking, hovering } = stateRef.current;

                cursorRef.current.className = `cursor-follower ${hidden ? 'hidden' : ''} ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`;
                dotRef.current.className = `cursor-dot ${hidden ? 'hidden' : ''} ${hovering ? 'hovering' : ''}`;
            }
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
            const isClickable = target && (
                (target.tagName && target.tagName.toLowerCase() === 'button') ||
                (target.tagName && target.tagName.toLowerCase() === 'a') ||
                (target.closest && target.closest('button')) ||
                (target.closest && target.closest('a')) ||
                (target.classList && target.classList.contains('clickable'))
            );

            const isHovering = !!isClickable;
            if (stateRef.current.hovering !== isHovering) {
                stateRef.current.hovering = isHovering;
                updateClasses();
            }
        };

        const onMouseEnter = () => {
            stateRef.current.hidden = false;
            updateClasses();
        };

        const onMouseLeave = () => {
            stateRef.current.hidden = true;
            updateClasses();
        };

        const onMouseDown = () => {
            stateRef.current.clicking = true;
            updateClasses();
        };

        const onMouseUp = () => {
            stateRef.current.clicking = false;
            updateClasses();
        };

        document.addEventListener("mousemove", onMouseMove, { passive: true });
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        // Initial setup
        updateClasses();

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
            <div ref={cursorRef} className="cursor-follower" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
};

export default CursorFollower;
