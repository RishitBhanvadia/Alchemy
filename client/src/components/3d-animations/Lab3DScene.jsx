import React from 'react';
import CanvasContainer from './CanvasContainer';

const Lab3DScene = () => {
    return (
        <div className="lab-3d-background">
            <CanvasContainer>
                {/* Removed ReactiveBeaker based on user feedback to clean up the UI */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
            </CanvasContainer>
        </div>
    );
};

export default Lab3DScene;
