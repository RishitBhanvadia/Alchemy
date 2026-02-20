import React from 'react';
import { OrbitControls } from '@react-three/drei';
import CanvasContainer from './CanvasContainer';
import FloatingMolecule from './FloatingMolecule';

const LandingScene = () => {
    return (
        <CanvasContainer style={{ zIndex: 1 }}>
            <FloatingMolecule />
            <OrbitControls enableZoom={false} enablePan={false} />
        </CanvasContainer>
    );
};

export default LandingScene;
