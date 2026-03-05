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


const Lab = () => {
  const app = useRef();

  const [animate, setAnimate] = useState(false);
  const [tcolor, SetTColor] = useState('');
  const navigate = useNavigate();
  const [chems, setChems] = useState({ A: 0, B: 0, C: 0, D: 0 });

  function change_tip(currentChems) {
    if (currentChems.A > 0) return SetTColor('#05B9C4');
    if (currentChems.B > 0) return SetTColor('#04CE7E');
    if (currentChems.C > 0) return SetTColor('#FBC2E3');
    if (currentChems.D > 0) return SetTColor('#DAA520');
    SetTColor('');
  }

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

  const handleChemChange = (type) => (e) => {
    const value = parseInt(e.target.value) || 0;
    const next = { ...chems, [type]: value };
    setChems(next);
    change_tip(next);
  };

  const useHandlePlayClick = () => {
    SetTColor("");
    // document.getElementsByClassName('video-game-button')[0].classList.add('cclick'); // Logic removed as button style changed
    setAnimate(true);
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: { chemA: chems.A, chemB: chems.B, chemC: chems.C, chemD: chems.D },
      });
    }, 1500); // Increased delay to show animation
  };

  function onOrNot() {
    return Object.values(chems).filter(val => val > 0).length >= 2;
  }

  const isPlayDisabled = !(onOrNot());

  // Determine status for 3D Beaker
  // Determine status for 3D Beaker (removed unused experimentStatus)

  return (
    <div className="lab-page" ref={app}>
      {/* Background 3D Layer */}
      <div className="lab-3d-background">
        <CanvasContainer>
          {/* Removed ReactiveBeaker based on user feedback to clean up the UI */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </CanvasContainer>
      </div>

      {/* Left Panel: Chemical Rack */}
      <div className="glass-panel chemical-rack">
        <h2 className="panel-title neon-glow">CHEMICAL RACK</h2>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#05B9C4' }}>
            <img src={hcl} alt="HCl" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="hcl-range">Conc. HCl</label>
            <input
              id="hcl-range"
              type="range"
              min="0"
              max={100 - chems.B - chems.C - chems.D}
              value={chems.A}
              onChange={handleChemChange('A')}
              className="sci-fi-range"
            />
            <span className="chem-value">{chems.A}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#04CE7E' }}>
            <img src={nacl} alt="NaCl" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="nacl-range">NaCl</label>
            <input
              id="nacl-range"
              type="range"
              min="0"
              max={100 - chems.A - chems.C - chems.D}
              value={chems.B}
              onChange={handleChemChange('B')}
              className="sci-fi-range"
            />
            <span className="chem-value">{chems.B}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#FBC2E3' }}>
            <img src={cuso4} alt="CuSO4" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="cuso4-range">CuSO4</label>
            <input
              id="cuso4-range"
              type="range"
              min="0"
              max={100 - chems.A - chems.B - chems.D}
              value={chems.C}
              onChange={handleChemChange('C')}
              className="sci-fi-range"
            />
            <span className="chem-value">{chems.C}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#DAA520' }}>
            <img src={feso4} alt="FeSO4" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="feso4-range">FeSO4</label>
            <input
              id="feso4-range"
              type="range"
              min="0"
              max={100 - chems.A - chems.B - chems.C}
              value={chems.D}
              onChange={handleChemChange('D')}
              className="sci-fi-range"
            />
            <span className="chem-value">{chems.D}%</span>
          </div>
        </div>
      </div>

      {/* Center Area: Test Tube Visualization */}
      <div className="center-stage">
        <div className="test_tube-wrapper">
          <div className="test_tube">
            <CustomTestTube color={tcolor} hasLiquid={chems.A > 0 || chems.B > 0 || chems.C > 0 || chems.D > 0} />
          </div>
          {/* Reaction indicators (visuals) */}
          <div className="reaction-indicators">
            <div className="indicator h" style={{ height: `${3.23 * chems.A}px`, background: '#05B9C4' }}></div>
            <div className="indicator n" style={{ height: `${3.23 * chems.B}px`, background: '#04CE7E' }}></div>
            <div className="indicator c" style={{ height: `${3.23 * chems.C}px`, background: '#FBC2E3' }}></div>
            <div className="indicator f" style={{ height: `${3.23 * chems.D}px`, background: '#DAA520' }}></div>
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

      {/* Right Panel: Status/Info (Optional, kept minimal for now) */}
      <div className="glass-panel status-panel">
        <h3 className="status-title">STATUS</h3>
        <div className="status-item">
          <span className="label">System:</span>
          <span className="value neon-text">ONLINE</span>
        </div>
        {/* Simplified for students as requested (removed Temp/Pressure) */}
        <div className="note-box">
          <span className="note-warn">NOTE:</span> All solutions are 1 M
        </div>
      </div>
    </div>
  );
};

export default Lab;
