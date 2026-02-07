import React from 'react';
import { Canvas } from '@react-three/fiber';

const CanvasContainer = ({ children, style, ...props }) => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
            <Canvas {...props} style={{ pointerEvents: 'auto' }}>
                {children}
            </Canvas>
        </div>
    );
};

export default CanvasContainer;
