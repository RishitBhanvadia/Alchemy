/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import PropTypes from 'prop-types';

const CanvasContainer = ({ children, style = {} }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}>
            <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />

                <group position={[0, -1, 0]}>
                    {children}
                </group>

                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={4} color="#00ffff" />
                <Environment preset="city" />
                <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
            </Canvas>
        </div>
    );
};

CanvasContainer.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
};

export default CanvasContainer;