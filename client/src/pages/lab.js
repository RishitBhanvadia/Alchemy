import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";
import CustomTestTube from "../components/testtube";
import hcl from '../assets/hcl.png'
import feso4 from '../assets/feso4.png'
import cuso4 from '../assets/cuso4.png'
import nacl from '../assets/nacl.png'
import "./lab.css"

const Lab = () => {
  const app = useRef();

  const [animate, setAnimate] = useState(false);
  // Removed unused 'arr' state which was causing unnecessary complexity
  const [tcolor, SetTColor] = useState('');
  const navigate = useNavigate();
  const [chemA, setChemA] = useState(0);
  const [chemB, setChemB] = useState(0);
  const [chemC, setChemC] = useState(0);
  const [chemD, setChemD] = useState(0);

  // Optimized change_tip to accept current values instead of relying on stale state
  function change_tip(valA, valB, valC, valD) {
    if (valA > 0) {
      SetTColor('#05B9C4');
    }
    else if (valB > 0) {
      SetTColor('#04CE7E');
    }
    else if (valC > 0) {
      SetTColor('#FBC2E3');
    }
    else if (valD > 0) {
      SetTColor('#DAA520');
    }
    else {
      SetTColor("");
    }
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
      return () => ctx && ctx.revert();
    }
  }, [animate]);

  const handleChemAChange = (e) => {
    const value = parseInt(e.target.value);
    setChemA(value);
    change_tip(value, chemB, chemC, chemD);
  };

  const handleChemBChange = (e) => {
    const value = parseInt(e.target.value);
    setChemB(value);
    change_tip(chemA, value, chemC, chemD);
  };

  const handleChemCChange = (e) => {
    const value = parseInt(e.target.value);
    setChemC(value);
    change_tip(chemA, chemB, value, chemD);
  };

  const handleChemDChange = (e) => {
    const value = parseInt(e.target.value);
    setChemD(value);
    change_tip(chemA, chemB, chemC, value);
  };

  const useHandlePlayClick = () => {
    SetTColor("");
    setAnimate(true);
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: { chemA, chemB, chemC, chemD },
      });
    }, 1500);
  };

  function onOrNot() {
    var sum = 0;
    if (chemA > 0) sum += 1;
    if (chemB > 0) sum += 1;
    if (chemC > 0) sum += 1;
    if (chemD > 0) sum += 1;
    return sum >= 2;
  }

  const isPlayDisabled = !(onOrNot());

  return (
    <div className="lab-page" ref={app}>
      {/* Background Layer - Removed heavy 3D canvas for performance */}
      <div className="lab-background-overlay"></div>

      {/* Left Panel: Chemical Rack */}
      <div className="glass-panel chemical-rack">
        <h2 className="panel-title neon-glow">CHEMICAL RACK</h2>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#05B9C4' }}>
            <img src={hcl} alt="HCl" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="hcl-input">Conc. HCl</label>
            <input
              id="hcl-input"
              type="range"
              min="0"
              max={100 - chemB - chemC - chemD}
              value={chemA}
              onChange={handleChemAChange}
              className="sci-fi-range"
            />
            <span className="chem-value">{chemA}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#04CE7E' }}>
            <img src={nacl} alt="NaCl" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="nacl-input">NaCl</label>
            <input
              id="nacl-input"
              type="range"
              min="0"
              max={100 - chemA - chemC - chemD}
              value={chemB}
              onChange={handleChemBChange}
              className="sci-fi-range"
            />
            <span className="chem-value">{chemB}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#FBC2E3' }}>
            <img src={cuso4} alt="CuSO4" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="cuso4-input">CuSO4</label>
            <input
              id="cuso4-input"
              type="range"
              min="0"
              max={100 - chemA - chemB - chemD}
              value={chemC}
              onChange={handleChemCChange}
              className="sci-fi-range"
            />
            <span className="chem-value">{chemC}%</span>
          </div>
        </div>

        <div className="chem-control-group">
          <div className="chem-icon-wrapper" style={{ borderColor: '#DAA520' }}>
            <img src={feso4} alt="FeSO4" className="chem-icon" />
          </div>
          <div className="range-wrapper">
            <label htmlFor="feso4-input">FeSO4</label>
            <input
              id="feso4-input"
              type="range"
              min="0"
              max={100 - chemA - chemB - chemC}
              value={chemD}
              onChange={handleChemDChange}
              className="sci-fi-range"
            />
            <span className="chem-value">{chemD}%</span>
          </div>
        </div>
      </div>

      {/* Center Area: Test Tube Visualization */}
      <div className="center-stage">
        <div className="test_tube-wrapper">
          <div className="test_tube">
            <CustomTestTube color={tcolor} hasLiquid={chemA > 0 || chemB > 0 || chemC > 0 || chemD > 0} />
          </div>
          {/* Reaction indicators (visuals) */}
          <div className="reaction-indicators">
            <div className="indicator h" style={{ height: `${3.23 * chemA}px`, background: '#05B9C4' }}></div>
            <div className="indicator n" style={{ height: `${3.23 * chemB}px`, background: '#04CE7E' }}></div>
            <div className="indicator c" style={{ height: `${3.23 * chemC}px`, background: '#FBC2E3' }}></div>
            <div className="indicator f" style={{ height: `${3.23 * chemD}px`, background: '#DAA520' }}></div>
          </div>
        </div>

        <button
          className={`action-button ${!isPlayDisabled ? 'active' : ''}`}
          disabled={isPlayDisabled}
          onClick={useHandlePlayClick}
        >
          {!animate ? 'INITIATE REACTION' : (
            <div className="processing-state">
              <span className="spinner"></span> PROCESSING...
            </div>
          )}
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
