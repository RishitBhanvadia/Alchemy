import React from 'react';
import CanvasContainer from '../components/3d-animations/CanvasContainer';
import FloatingMolecule from '../components/3d-animations/FloatingMolecule';
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
