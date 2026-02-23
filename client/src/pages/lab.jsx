import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
  { id: 'chemD', name: 'FeSO4', icon: feso4, color: '#DAA520', indicatorClass: 'f' },
];

const Lab = () => {
  const app = useRef();

  const [animate, setAnimate] = useState(false);
  const [tcolor, SetTColor] = useState('');
  const navigate = useNavigate();

  const [chemicals, setChemicals] = useState({
    chemA: 0,
    chemB: 0,
    chemC: 0,
    chemD: 0
  });

  // Update tip color based on first active chemical
  useEffect(() => {
    const activeChem = CHEMICALS.find(c => chemicals[c.id] > 0);
    SetTColor(activeChem ? activeChem.color : '');
  }, [chemicals]);

  useLayoutEffect(() => {
    if (animate) {
      let ctx = gsap.context(() => {
        // use scoped selectors
        gsap.fromTo(".test_tube", { rotation: -9 }, { duration: 0.12, rotation: 6, repeat: -1 });
        gsap.fromTo(".h", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".n", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".c", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".f", { opacity: 1 }, { duration: 0.12, opacity: 0 });

      }, app);
      return () => ctx.revert();
    }
  }, [animate]);

  const handleChemicalChange = (id, e) => {
    const value = parseInt(e.target.value);
    setChemicals(prev => ({ ...prev, [id]: value }));
  };

  const useHandlePlayClick = () => {
    SetTColor("");
    setAnimate(true);
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: chemicals,
      });
    }, 1500);
  };

  const onOrNot = () => {
    const activeCount = Object.values(chemicals).filter(v => v > 0).length;
    return activeCount >= 2;
  }

  const isPlayDisabled = !(onOrNot());
  const totalVolume = Object.values(chemicals).reduce((a, b) => a + b, 0);

  return (
    <div className="lab-page" ref={app}>
      {/* Background 3D Layer */}
      <div className="lab-3d-background">
        <CanvasContainer>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </CanvasContainer>
      </div>

      {/* Left Panel: Chemical Rack */}
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
                max={100 - (totalVolume - chemicals[chem.id])}
                value={chemicals[chem.id]}
                onChange={(e) => handleChemicalChange(chem.id, e)}
                className="sci-fi-range"
              />
              <span className="chem-value">{chemicals[chem.id]}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Center Area: Test Tube Visualization */}
      <div className="center-stage">
        <div className="test_tube-wrapper">
          <div className="test_tube">
            <CustomTestTube
              color={tcolor}
              hasLiquid={totalVolume > 0}
            />
          </div>
          {/* Reaction indicators (visuals) */}
          <div className="reaction-indicators">
            {CHEMICALS.map((chem) => (
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
        {isPlayDisabled && !animate && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '15px', textAlign: 'center', opacity: 0.8 }}>
            Add at least 2 chemicals to start reaction
          </p>
        )}
      </div>

      {/* Right Panel: Status/Info */}
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
