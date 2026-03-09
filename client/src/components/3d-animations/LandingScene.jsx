import React from 'react';
import CanvasContainer from './CanvasContainer';
import FloatingMolecule from './FloatingMolecule';
import { OrbitControls } from '@react-three/drei';

const LandingScene = () => {
    return (
        <CanvasContainer style={{ zIndex: 1 }}>
            <FloatingMolecule />
            <OrbitControls enableZoom={false} enablePan={false} />
        </CanvasContainer>
    );
};

export default LandingScene;
