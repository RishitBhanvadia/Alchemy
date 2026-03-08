import React from 'react';
import { OrbitControls } from '@react-three/drei';
import CanvasContainer from './CanvasContainer';
import FloatingMolecule from './FloatingMolecule';

// ⚡ Bolt Optimisation: Entire 3D scene wrapped to avoid React/R3F reconciler bugs.
// The whole CanvasContainer is lazy-loaded asynchronously in Landing.jsx.
const LandingScene = () => {
    return (
        <CanvasContainer style={{ zIndex: 1 }}>
            <FloatingMolecule />
            <OrbitControls enableZoom={false} enablePan={false} />
        </CanvasContainer>
    );
};

export default LandingScene;
