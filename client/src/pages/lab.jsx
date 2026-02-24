import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";
import CustomTestTube from "../components/testtube";
import hcl from '../assets/hcl.png'
import feso4 from '../assets/feso4.png'
import cuso4 from '../assets/cuso4.png'
import nacl from '../assets/nacl.png'
import "./lab.css"
import CanvasContainer from '../components/3d-animations/CanvasContainer';

const CHEMICALS = [
    { id: 'chemA', name: 'Conc. HCl', icon: hcl, color: '#05B9C4', indicatorClass: 'h' },
    { id: 'chemB', name: 'NaCl', icon: nacl, color: '#04CE7E', indicatorClass: 'n' },
    { id: 'chemC', name: 'CuSO4', icon: cuso4, color: '#FBC2E3', indicatorClass: 'c' },
    { id: 'chemD', name: 'FeSO4', icon: feso4, color: '#DAA520', indicatorClass: 'f' }
];

const Lab = () => {
    const app = useRef();
    const navigate = useNavigate();

    const [animate, setAnimate] = useState(false);
    const [chemicals, setChemicals] = useState({
        chemA: 0,
        chemB: 0,
        chemC: 0,
        chemD: 0
    });

    // Derive tcolor from chemicals state (Priority: A > B > C > D)
    const getTipColor = () => {
        const activeChem = CHEMICALS.find(chem => chemicals[chem.id] > 0);
        return activeChem ? activeChem.color : '';
    };

    const tcolor = getTipColor();

    useLayoutEffect(() => {
        if (animate) {
            let ctx = gsap.context(() => {
                gsap.fromTo(".test_tube", { rotation: -9 }, { duration: 0.12, rotation: 6, repeat: -1 });
                // Animate indicators
                CHEMICALS.forEach(chem => {
                    gsap.fromTo(`.${chem.indicatorClass}`, { opacity: 1 }, { duration: 0.12, opacity: 0 });
                });
            }, app);
            return () => ctx.revert();
        }
    }, [animate]);

    const handleChemicalChange = (id, value) => {
        setChemicals(prev => ({
            ...prev,
            [id]: parseInt(value) || 0
        }));
    };

    const useHandlePlayClick = () => {
        setAnimate(true);
        setTimeout(() => {
            navigate("/result", {
                replace: true,
                state: chemicals,
            });
        }, 1500);
    };

    const onOrNot = () => {
        // Count how many chemicals have > 0 volume
        const count = Object.values(chemicals).filter(val => val > 0).length;
        return count >= 2;
    };

    const isPlayDisabled = !(onOrNot());

    return (
        <div className="lab-page" ref={app}>
            <div className="lab-3d-background">
                <CanvasContainer>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                </CanvasContainer>
            </div>

            <div className="glass-panel chemical-rack">
                <h2 className="panel-title neon-glow">CHEMICAL RACK</h2>

                {CHEMICALS.map((chem) => {
                    // Calculate max allowed value for this chemical
                    // It is 100 - sum of all other chemicals
                    const currentSum = Object.entries(chemicals)
                        .filter(([key]) => key !== chem.id)
                        .reduce((acc, [, val]) => acc + val, 0);
                    const maxVal = 100 - currentSum;

                    return (
                        <div className="chem-control-group" key={chem.id}>
                            <div className="chem-icon-wrapper" style={{ borderColor: chem.color }}>
                                <img src={chem.icon} alt={chem.name} className="chem-icon" />
                            </div>
                            <div className="range-wrapper">
                                <label htmlFor={`${chem.id}-range`}>{chem.name}</label>
                                <input
                                    id={`${chem.id}-range`}
                                    type="range"
                                    min="0"
                                    max={maxVal}
                                    value={chemicals[chem.id]}
                                    onChange={(e) => handleChemicalChange(chem.id, e.target.value)}
                                    className="sci-fi-range"
                                />
                                <span className="chem-value">{chemicals[chem.id]}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="center-stage">
                <div className="test_tube-wrapper">
                    <div className="test_tube">
                        <CustomTestTube
                            color={tcolor}
                            hasLiquid={Object.values(chemicals).some(val => val > 0)}
                        />
                    </div>
                    <div className="reaction-indicators">
                        {CHEMICALS.map(chem => (
                            <div
                                key={chem.id}
                                className={`indicator ${chem.indicatorClass}`}
                                style={{
                                    height: `${3.23 * chemicals[chem.id]}px`,
                                    background: chem.color
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                <button
                    className={`action-button ${!isPlayDisabled ? 'active' : ''}`}
                    disabled={isPlayDisabled}
                    onClick={useHandlePlayClick}
                >
                    {!animate ? 'INITIATE REACTION' : 'PROCESSING...'}
                </button>
                {isPlayDisabled && (
                    <p className="helper-text">Add at least two chemicals to initiate reaction</p>
                )}
            </div>

            <div className="glass-panel status-panel">
                <h3 className="status-title">STATUS</h3>
                <div className="status-item">
                    <span className="label">System:</span>
                    <span className="value neon-text">ONLINE</span>
                </div>
                <div className="note-box">
                    <span className="note-warn">NOTE:</span> All solutions are 1 M
                </div>
            </div>
        </div>
    );
};

export default Lab;
