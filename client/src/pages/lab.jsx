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
  const [tcolor, SetTColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [chemA, setChemA] = useState(0);
  const [chemB, setChemB] = useState(0);
  const [chemC, setChemC] = useState(0);
  const [chemD, setChemD] = useState(0);



  function change_tip(newChemA, newChemB, newChemC, newChemD) {
    if (newChemA > 0) {
      SetTColor('#05B9C4');
    } else if (newChemB > 0) {
      SetTColor('#04CE7E');
    } else if (newChemC > 0) {
      SetTColor('#FBC2E3');
    } else if (newChemD > 0) {
      SetTColor('#DAA520');
    } else {
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
      return () => ctx.revert();
    }
  }, [animate]);

  const handleChemChange = (setter, chemId) => (e) => {
    const value = parseInt(e.target.value) || 0;
    setter(value);

    // Pass latest values to change_tip to avoid stale state issues before next render
    const nextChemA = chemId === 'A' ? value : chemA;
    const nextChemB = chemId === 'B' ? value : chemB;
    const nextChemC = chemId === 'C' ? value : chemC;
    const nextChemD = chemId === 'D' ? value : chemD;

    change_tip(nextChemA, nextChemB, nextChemC, nextChemD);
  };

  const useHandlePlayClick = () => {
    // Prevent double-clicks
    if (isLoading) return;
    
    setIsLoading(true);
    SetTColor("");
    setAnimate(true);
    
    // Capture values at click time to avoid stale closure
    const snapshot = { chemA, chemB, chemC, chemD };
    
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: snapshot, // Use captured snapshot, not current state
      });
    }, 1500);
  };

  const isReactionReady = () => {
    let activeChemicalsCount = 0;
    if (chemA > 0) activeChemicalsCount += 1;
    if (chemB > 0) activeChemicalsCount += 1;
    if (chemC > 0) activeChemicalsCount += 1;
    if (chemD > 0) activeChemicalsCount += 1;
    return activeChemicalsCount >= 2;
  };

  const isPlayDisabled = !isReactionReady();



  return (
    <div className="lab-page" ref={app}>


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
              max={100 - chemB - chemC - chemD}
              value={chemA}
              onChange={handleChemChange(setChemA, 'A')}
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
            <label htmlFor="nacl-range">NaCl</label>
            <input
              id="nacl-range"
              type="range"
              min="0"
              max={100 - chemA - chemC - chemD}
              value={chemB}
              onChange={handleChemChange(setChemB, 'B')}
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
            <label htmlFor="cuso4-range">CuSO4</label>
            <input
              id="cuso4-range"
              type="range"
              min="0"
              max={100 - chemA - chemB - chemD}
              value={chemC}
              onChange={handleChemChange(setChemC, 'C')}
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
            <label htmlFor="feso4-range">FeSO4</label>
            <input
              id="feso4-range"
              type="range"
              min="0"
              max={100 - chemA - chemB - chemC}
              value={chemD}
              onChange={handleChemChange(setChemD, 'D')}
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
          className={`action-button ${!isPlayDisabled && !isLoading ? 'active' : ''}`}
          disabled={isPlayDisabled || isLoading}
          onClick={useHandlePlayClick}
        >
          {!isLoading ? 'INITIATE REACTION' : 'PROCESSING...'}
        </button>
      </div>

      {/* Right Panel: Status/Info (Optional, kept minimal for now) */}
      <div className="glass-panel status-panel">
        <h3 className="status-title">STATUS</h3>
        <div className="status-item">
          <span className="label">System:</span>
          <span className="value neon-text">ONLINE</span>
        </div>

      </div>
    </div>
  );
};

export default Lab;
