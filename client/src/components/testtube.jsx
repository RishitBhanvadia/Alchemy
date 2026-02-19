import React from "react";
import PropTypes from 'prop-types';

const CustomTestTube = ({ color, hasLiquid }) => {
    return (
        <svg viewBox="0 0 100 300" className="custom-test-tube">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Glass Tube Body */}
            <path
                d="M20 10 L20 250 A30 30 0 0 0 80 250 L80 10"
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
            />

            {/* Liquid Content */}
            {hasLiquid && (
                <path
                    d="M22 100 L22 250 A28 28 0 0 0 78 250 L78 100 Z"
                    fill={color || '#4facfe'}
                    opacity="0.8"
                    filter="url(#glow)"
                    className="liquid-anim"
                />
            )}

            {/* Highlights/Reflections */}
            <path
                d="M25 20 L25 240 A25 25 0 0 0 35 240 L35 20"
                fill="rgba(255, 255, 255, 0.2)"
            />
        </svg>
    );
};

CustomTestTube.propTypes = {
    color: PropTypes.string,
    hasLiquid: PropTypes.bool
};

export default CustomTestTube;