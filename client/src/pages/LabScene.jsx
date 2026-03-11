import React from 'react';
import CanvasContainer from '../components/3d-animations/CanvasContainer';

const LabScene = () => {
    return (
        <CanvasContainer>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </CanvasContainer>
    );
};

export default LabScene;
