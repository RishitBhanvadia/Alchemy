import logger from '../../utils/logger';
import React, { useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import PropTypes from 'prop-types';

/**
 * CanvasContainer — Shared wrapper for R3F Canvas.
 * Adds WebGL context loss handling, performance hints, and DPR limiting.
 */
const CanvasContainer = ({ children, style, ...props }) => {
    const handleCreated = useCallback(({ gl }) => {
        // Listen for WebGL context loss and attempt recovery
        const canvas = gl.domElement;

        const onContextLost = (e) => {
            e.preventDefault();
            logger.warn('[CanvasContainer] WebGL context lost — will attempt restore');
        };

        const onContextRestored = () => {
            logger.warn('[CanvasContainer] WebGL context restored');
        };

        canvas.addEventListener('webglcontextlost', onContextLost, false);
        canvas.addEventListener('webglcontextrestored', onContextRestored, false);

        // Store cleanup refs on the canvas element itself
        canvas.__contextHandlers = { onContextLost, onContextRestored };
    }, []);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
            <Canvas
                {...props}
                dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false,
                }}
                style={{ pointerEvents: 'auto', background: 'transparent' }}
                onCreated={handleCreated}
            >
                {children}
            </Canvas>
        </div>
    );
};

CanvasContainer.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
};

export default CanvasContainer;
