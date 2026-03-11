import React from 'react';
import { Canvas } from '@react-three/fiber';

import PropTypes from 'prop-types';

const CanvasContainer = ({ children, style, ...props }) => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
            <Canvas {...props} style={{ pointerEvents: 'auto', background: 'transparent' }}>
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
