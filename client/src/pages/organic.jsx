/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

import CompoundImg from "../components/compoundImg";
import ExpResult from "./experiment_result";
import "./lab.css"
import './organic.css'

const Organic = () => {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);
  const [first, setFirst] = useState(true);
  const [datanum, setDatanum] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [uans, setUAns] = useState('');

  // Animation logic for result
  function send_info(i) {
    setOn(true);
    setTimeout(() => {
      setOn(false);
    }, 1000);
    setFirst(false);
    setDatanum(i);
  }

  async function checkAns() {
    if (uans === '2') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('experiment_results')
            .insert([
              {
                user_id: user.id,
                experiment_type: 'organic',
                score: 100,
                details: { result: "Group 2 Detected" }
              }
            ]);
            
          if (error) {
             logger.error("Error saving organic result:", error);
          } else {
             logger.info("Organic result saved successfully");
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
