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
  { id: 'chemA', name: 'Conc. HCl', color: '#05B9C4', icon: hcl },
  { id: 'chemB', name: 'NaCl', color: '#04CE7E', icon: nacl },
  { id: 'chemC', name: 'CuSO4', color: '#FBC2E3', icon: cuso4 },
  { id: 'chemD', name: 'FeSO4', color: '#DAA520', icon: feso4 },
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

  // Calculate total volume to determine if tube has liquid
  const totalVolume = Object.values(chemicals).reduce((sum, val) => sum + val, 0);

  // Determine tip color based on the first chemical with volume > 0 (maintaining priority A>B>C>D)
  const activeChem = CHEMICALS.find(chem => chemicals[chem.id] > 0);
  const tcolor = activeChem ? activeChem.color : '';

  useLayoutEffect(() => {
    if (animate) {
      let ctx = gsap.context(() => {
        gsap.fromTo(".test_tube", { rotation: -9 }, { duration: 0.12, rotation: 6, repeat: -1 });

        // Animate indicators based on active chemicals
        CHEMICALS.forEach(chem => {
             gsap.fromTo(`.indicator-${chem.id}`, { opacity: 1 }, { duration: 0.12, opacity: 0 });
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

  const calculateMax = (currentId) => {
    const otherSum = Object.entries(chemicals)
      .filter(([key]) => key !== currentId)
      .reduce((sum, [, val]) => sum + val, 0);
    return 100 - otherSum;
  };

  const useHandlePlayClick = () => {
    setAnimate(true);
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: { ...chemicals },
      });
    }, 1500);
  };

  const isPlayDisabled = Object.values(chemicals).filter(v => v > 0).length < 2;

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

        {CHEMICALS.map((chem) => (
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
                max={calculateMax(chem.id)}
                value={chemicals[chem.id]}
                onChange={(e) => handleChemicalChange(chem.id, e.target.value)}
                className="sci-fi-range"
              />
              <span className="chem-value">{chemicals[chem.id]}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="center-stage">
        <div className="test_tube-wrapper">
          <div className="test_tube">
            <CustomTestTube color={tcolor} hasLiquid={totalVolume > 0} />
          </div>
          <div className="reaction-indicators">
            {CHEMICALS.map((chem) => (
              <div
                key={chem.id}
                className={`indicator indicator-${chem.id}`}
                style={{ height: `${3.23 * chemicals[chem.id]}px`, background: chem.color }}
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
