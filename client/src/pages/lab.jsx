import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";
import CustomTestTube from "../components/testtube";
import hcl from '../assets/hcl.png'
import feso4 from '../assets/feso4.png'
import cuso4 from '../assets/cuso4.png'
import nacl from '../assets/nacl.png'
import "./lab.css"
import CanvasContainer from '../components/3d-animations/CanvasContainer';

const CHEMICALS_CONFIG = [
  { id: 'hcl', name: 'Conc. HCl', color: '#05B9C4', img: hcl, label: 'Conc. HCl' },
  { id: 'nacl', name: 'NaCl', color: '#04CE7E', img: nacl, label: 'NaCl' },
  { id: 'cuso4', name: 'CuSO4', color: '#FBC2E3', img: cuso4, label: 'CuSO4' },
  { id: 'feso4', name: 'FeSO4', color: '#DAA520', img: feso4, label: 'FeSO4' },
];

const Lab = () => {
  const app = useRef();
  const navigate = useNavigate();

  const [chemicals, setChemicals] = useState({
    hcl: 0,
    nacl: 0,
    cuso4: 0,
    feso4: 0
  });

  const [animate, setAnimate] = useState(false);

  // Derived state: Determine the dominant color based on priority (Order in CONFIG matters)
  const tcolor = useMemo(() => {
    const activeChem = CHEMICALS_CONFIG.find(chem => chemicals[chem.id] > 0);
    return activeChem ? activeChem.color : '';
  }, [chemicals]);

  const totalVolume = useMemo(() => {
    return Object.values(chemicals).reduce((a, b) => a + b, 0);
  }, [chemicals]);

  useLayoutEffect(() => {
    if (animate) {
      let ctx = gsap.context(() => {
        gsap.fromTo(".test_tube", { rotation: -9 }, { duration: 0.12, rotation: 6, repeat: -1 });
        CHEMICALS_CONFIG.forEach(chem => {
          gsap.fromTo(`.indicator-${chem.id}`, { opacity: 1 }, { duration: 0.12, opacity: 0 });
        });
      }, app);
      return () => ctx.revert();
    }
  }, [animate]);

  const handleChemicalChange = (id, value) => {
    const intValue = parseInt(value) || 0;
    setChemicals(prev => ({
      ...prev,
      [id]: intValue
    }));
  };

  const useHandlePlayClick = () => {
    setAnimate(true);
    setTimeout(() => {
      // Navigate with legacy prop names for compatibility if result page expects them
      // Assuming result page expects chemA, chemB, chemC, chemD
      // Mapping: hcl -> chemA, nacl -> chemB, cuso4 -> chemC, feso4 -> chemD
      navigate("/result", {
        replace: true,
        state: {
          chemA: chemicals.hcl,
          chemB: chemicals.nacl,
          chemC: chemicals.cuso4,
          chemD: chemicals.feso4
        },
      });
    }, 1500);
  };

  const activeCount = Object.values(chemicals).filter(v => v > 0).length;
  const isPlayDisabled = activeCount < 2;

  // Determine if any liquid is present for test tube visualization
  const hasLiquid = totalVolume > 0;

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

        {CHEMICALS_CONFIG.map((chem) => (
          <div className="chem-control-group" key={chem.id}>
            <div className="chem-icon-wrapper" style={{ borderColor: chem.color }}>
              <img src={chem.img} alt={chem.name} className="chem-icon" />
            </div>
            <div className="range-wrapper">
              <label htmlFor={`${chem.id}-range`}>{chem.label}</label>
              <input
                id={`${chem.id}-range`}
                type="range"
                min="0"
                max={100 - (totalVolume - chemicals[chem.id])}
                value={chemicals[chem.id]}
                onChange={(e) => handleChemicalChange(chem.id, e.target.value)}
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
            <CustomTestTube color={tcolor} hasLiquid={hasLiquid} />
          </div>
          {/* Reaction indicators (visuals) */}
          <div className="reaction-indicators">
            {CHEMICALS_CONFIG.map((chem) => (
              <div
                key={chem.id}
                className={`indicator indicator-${chem.id}`}
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
