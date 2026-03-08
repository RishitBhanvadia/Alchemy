import React from 'react';
import CanvasContainer from './CanvasContainer';

const LabScene = () => {
    return (
        <CanvasContainer>
            {/* Removed ReactiveBeaker based on user feedback to clean up the UI */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </CanvasContainer>
    );
};

export default LabScene;
