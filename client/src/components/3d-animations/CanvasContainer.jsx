/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import PropTypes from 'prop-types';

const CanvasContainer = ({ children, style }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none', ...style }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
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
