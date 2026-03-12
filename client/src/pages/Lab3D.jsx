import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CanvasContainer from '../components/3d-animations/CanvasContainer';
import PhysicsLab from '../components/3d-animations/PhysicsLab';
import "./Lab3D.css"; // We'll create a dedicated CSS file

const Lab3D = () => {
    const navigate = useNavigate();
    const [chemA, setChemA] = useState(0);
    const [chemB, setChemB] = useState(0);
    const [chemC, setChemC] = useState(0);
    const [chemD, setChemD] = useState(0);

    const useHandlePlayClick = () => {
        // Simple nav to result for now
        navigate("/result", {
            replace: true,
            state: { chemA, chemB, chemC, chemD },
        });
    };

    function onOrNot() {
        let sum = 0;
        if (chemA > 0) sum += 1;
        if (chemB > 0) sum += 1;
        if (chemC > 0) sum += 1;
        if (chemD > 0) sum += 1;
        return sum >= 2;
    }

    const isPlayDisabled = !(onOrNot());

    return (
        <div className="lab3d-page">
            <div className="lab3d-header glass-panel">
                <h2 className="neon-glow">3D PHYSICS LABORATORY</h2>
                <p>Drag and pour the chemicals into the beaker using interactive physics!</p>
            </div>

            {/* Dedicated 3D Canvas Area */}
            <div className="lab3d-canvas-wrapper">
                <CanvasContainer camera={{ position: [0, 0, 10], fov: 50 }}>
                    <PhysicsLab
                        chemStates={{ chemA, chemB, chemC, chemD }}
                        setChemA={setChemA}
                        setChemB={setChemB}
                        setChemC={setChemC}
                        setChemD={setChemD}
                    />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                </CanvasContainer>
            </div>

            {/* Dedicated UI Controls below or to the side */}
            <div className="lab3d-controls-container">
                <div className="glass-panel chem-levels-panel">
                    <h3>Chemical Levels</h3>
                    <div className="level-bar-group">
                        <label htmlFor="chemA-bar">HCl (Clear)</label>
                        <div id="chemA-bar" className="level-bar-container"><div className="level-bar-fill" style={{ width: `${chemA}%`, backgroundColor: '#05B9C4' }}></div></div>
                        <span>{Math.round(chemA)}%</span>
                    </div>
                    <div className="level-bar-group">
                        <label htmlFor="chemB-bar">NaCl (Green)</label>
                        <div id="chemB-bar" className="level-bar-container"><div className="level-bar-fill" style={{ width: `${chemB}%`, backgroundColor: '#04CE7E' }}></div></div>
                        <span>{Math.round(chemB)}%</span>
                    </div>
                    <div className="level-bar-group">
                        <label htmlFor="chemC-bar">CuSO4 (Pink)</label>
                        <div id="chemC-bar" className="level-bar-container"><div className="level-bar-fill" style={{ width: `${chemC}%`, backgroundColor: '#FBC2E3' }}></div></div>
                        <span>{Math.round(chemC)}%</span>
                    </div>
                    <div className="level-bar-group">
                        <label htmlFor="chemD-bar">FeSO4 (Gold)</label>
                        <div id="chemD-bar" className="level-bar-container"><div className="level-bar-fill" style={{ width: `${chemD}%`, backgroundColor: '#DAA520' }}></div></div>
                        <span>{Math.round(chemD)}%</span>
                    </div>
                </div>

                <div className="lab3d-actions">
                    <button
                        className={`action-button ${!isPlayDisabled ? 'active' : ''}`}
                        disabled={isPlayDisabled}
                        onClick={useHandlePlayClick}
                    >
                        INITIATE REACTION
                    </button>
                    {!onOrNot() && <div className="note-warn" style={{ marginTop: '1rem', textAlign: 'center' }}>Mix at least 2 chemicals</div>}
                </div>
            </div>
        </div>
    );
};

export default Lab3D;
