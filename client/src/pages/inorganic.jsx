/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

import InCompoundImg from "../components/InCompundImg"; // Fixed typo in import if needed, but file is InCompundImg.js
import InExpResult from "../components/InExpResult";
import "./lab.css";
import "./inorganic.css";

const Inorganic = () => {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);
  const [first, setFirst] = useState(true);
  const [datanum, setDatanum] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [uans, setUAns] = useState('');

  function send_info(i) {
    setOn(true);
    setTimeout(() => {
      setOn(false);
    }, 1000);
    setFirst(false);
    setDatanum(i);
  }

  async function checkAns() {
    if (uans.toLowerCase() === 'nitrite') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('experiment_results')
            .insert([
              {
                user_id: user.id,
                experiment_type: 'inorganic',
                score: 100,
                details: { result: "Nitrite Detected" }
              }
            ]);
            
          if (error) {
             logger.error("Error saving inorganic result:", error);
          } else {
             logger.info("Inorganic result saved successfully");
          }
        }
      } catch (err) {
        logger.error("Supabase error:", err);
      }
      navigate("/success", {
        replace: true,
      });
    }
    else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
      }, 1000);
    }
  }

  const handleChange = (event) => {
    setUAns(event.target.value);
  };

  return (
    <div className="inorganic-page">
      <Navbar />

      <div className="inorganic-container">
        <h1 className="neon-glow page-title">INORGANIC ANALYSIS</h1>

        <div className="glass-panel experiment-panel">
          <div className="note-display">
            <span className="note-label">NOTE:</span> Refer Your Chemistry Lab Manual Page - 51
          </div>

          <div className="experiment-stage">
            {first ? (
              <div className="fade-in">
                <InCompoundImg />
              </div>
            ) : (
              <div className="fade-in result-container">
                <InExpResult num={datanum} on={on} />
              </div>
            )}
          </div>

          <div className="controls-grid">
            <button onClick={() => send_info(0)} className="neon-button test-btn">PT - H2SO4</button>
            <button onClick={() => send_info(1)} className="neon-button test-btn">CT - Carbonate</button>
            <button onClick={() => send_info(2)} className="neon-button test-btn">CT - Sulphide</button>
            <button onClick={() => send_info(3)} className="neon-button test-btn">CT - Sulphite</button>
            <button onClick={() => send_info(4)} className="neon-button test-btn">CT - Nitrite</button>
            <button onClick={() => send_info(5)} className="neon-button test-btn">CT - Acetate</button>
            <button onClick={() => send_info(6)} className="neon-button test-btn">PT - conc. H2SO4</button>
            <button onClick={() => send_info(7)} className="neon-button test-btn">CT - Chloride</button>
            <button onClick={() => send_info(8)} className="neon-button test-btn">CT - Bromide</button>
            <button onClick={() => send_info(9)} className="neon-button test-btn">CT - Iodide</button>
            <button onClick={() => send_info(10)} className="neon-button test-btn">CT - Nitrate</button>
            <button onClick={() => send_info(11)} className="neon-button test-btn">CT - Oxalate</button>
          </div>

          <div className="answer-section">
            <div className="glass-input-group">
              <span className="input-label">ANION</span>
              <input
                type="text"
                className={`glass-input ${wrong ? 'shake-error' : ''}`}
                onChange={handleChange}
                placeholder="Nitrite, Carbonate..."
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

export default Inorganic;
