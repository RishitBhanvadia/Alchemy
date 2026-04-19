import React from "react";
import Navbar from "../components/Navbar";

import CompoundImg from "../components/compoundImg";
import ExpResult from "./experiment_result";
import useExperimentTest from "../hooks/useExperimentTest";
import "./lab.css"
import './organic.css'

const Organic = () => {
  const {
    on,
    first,
    datanum,
    wrong,
    uans,
    send_info,
    checkAns,
    handleChange
  } = useExperimentTest('organic', (ans) => ans === '2', "Group 2 Detected");

  return (
    <div className="organic-page">
      <Navbar />

      <div className="organic-container">
        <h1 className="neon-glow page-title">ORGANIC ANALYISIS</h1>

        <div className="glass-panel experiment-panel">
          <div className="note-display">
            <span className="note-label">NOTE:</span> Refer Your Chemistry Lab Manual Page - 70
          </div>

          <div className="experiment-visuals">
            {first ? (
              <div className="fade-in">
                <CompoundImg />
              </div>
            ) : (
              <div className="fade-in">
                <ExpResult num={datanum} on={on} />
              </div>
            )}
          </div>

          <div className="controls-grid">
            {[0, 1, 2, 3, 4, 5, 6].map((groupNum) => (
              <button
                key={groupNum}
                onClick={() => send_info(groupNum)}
                className="neon-button test-btn"
              >
                Group {groupNum} Test
              </button>
            ))}
          </div>

          <div className="answer-section">
            <div className="glass-input-group">
              <span className="input-label">GROUP</span>
              <input
                type="text"
                className={`glass-input ${wrong ? 'shake-error' : ''}`}
                onChange={handleChange}
                placeholder="0, 1, 2, 3..."
              />
              <button onClick={() => checkAns()} className="neon-button submit-btn">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organic;
