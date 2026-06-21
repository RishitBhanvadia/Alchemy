/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import { getTitrationData } from '../utils/api';
import "./titration.css";
import Polygon from "../components/Polygon";
import TitrationSetup from "../components/titration_setup";
import hcl from "../assets/hc.png";
import nacl from '../assets/h2so4.png';
import AB from '../assets/ab.png';
import logger from '../utils/logger';

const Titration = () => {
  const [all_data, setAllData] = useState([]);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchTitrationData = async () => {
        try {
            const res = await getTitrationData();
            const fetchedData = res.data;
            
            // Map DB structure to frontend structure if needed
            // Assuming DB returns array of { reaction_id, points: [], color: [] }
            setAllData(fetchedData);
            if(fetchedData.length > 0) setData(fetchedData[0]);
        } catch (err) {
            logger.error("Failed to fetch titration data:", err);
            // Fallback
            const fallback = [
                {
                  "reaction_id": "A",
                  "points": [8, 8.5, 9, 9.5, 10],
                  "color": ["#bf006b", "#bb0062", "#b80063", "#b70061", "#b8006a"]
                }
            ];
            setAllData(fallback);
            setData(fallback[0]);
        }
    };
    fetchTitrationData();
  }, []);



  // State

  const [shaking, setShaking] = useState(false);
  const [confirm, setConfirm] = useState(true);
  const [add_acid, setAddAcid] = useState(false);
  const [drop, setDrop] = useState(false);
  const [stopp, setStop] = useState(false);
  const [shake, setShake] = useState(false);
  const [add_kmn, setKMN] = useState(false);
  const [swipe, setSwipe] = useState(true);
  const [acid_heigth, setAcid] = useState("M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V 687.637H226.348Z");
  const [sColor, SetSColor] = useState('#3accff');
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [message, setMessage] = useState("");

  // Logic to save result
  const saveResult = async (finalCount) => {
    // Calibrate score: 100 is target.
    // Score = 100 - difference. Min 0.
    const diff = Math.abs(100 - finalCount);
    let score = 100 - diff;
    if (score < 0) score = 0;

    // Feedback message
    let feedback = "";
    if (score === 100) feedback = "Perfect Titration!";
    else if (score >= 90) feedback = "Great job! Very close.";
    else if (score >= 70) feedback = "Good attempt. Watch the color change closely.";
    else feedback = "Overshot or Undershot. Try again!";

    setMessage(`Score: ${score}/100. ${feedback}`);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('experiment_results')
          .insert([
            {
              user_id: user.id,
              experiment_type: 'Titration',
              score: score,
              details: { volume_used: finalCount, acid: swipe ? 'HCl' : 'H2SO4' }
            }
          ]);
        if (error) logger.error('Error saving result:', error);
        else setMessage("Result saved to database!");
      }
    } catch (e) {
      logger.error("Supabase error:", e);
    }
  };

  function setting_up_exp() {
    setConfirm(false);
    setAddAcid(true);
    if (swipe) setData(all_data[0]);
    else setData(all_data[1]);
  }

  // Timer Logic
  useEffect(() => {
    let timerId;
    if (isCounting && count < 100) {
      timerId = setInterval(() => {
        var made_str = "M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V" + (644 - ((count / 10) * 4.3)) + "H226.348Z";
        setAcid(made_str);
        setCount(prevCount => prevCount + 1);
      }, 100);
    }
    return () => {
      clearInterval(timerId);

    };
  }, [isCounting, count]);

  const handleStart = () => {
    if (drop && !isCounting) {

      setDrop(false);
      setStop(true);
      setIsCounting(true);
    }
  };

  const handleStop = () => {
    if (stopp) {
      setDrop(true);
      setStop(false);

      setIsCounting(false);
      saveResult(count); // Save when stopped
    }
  };

  const handleShake = () => {
    if (shake) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      for (var i = 0; i < data.points.length; i++) {
        if ((count / 10) >= data.points[i]) {
          SetSColor(data.color[i]);

        }
      }
    }
  }

  return (
    <div className="titration-page">
      <Navbar /> {/* New Top Navbar */}

      <div className="titration-container">

        {/* Left Control Panel */}
        <div className="glass-panel titration-controls">
          <div>
            <h2 className="panel-title neon-glow">TITRATION SETUP</h2>

            <div className="control-section">
              <div className="chem-selection">
                <div className="selection-row">
                  <span className="selection-label">ACID:</span>
                  <div className="chem-selector">
                    <button className="arrow-btn" disabled={swipe || !confirm} onClick={() => setSwipe(true)}>&lt;</button>
                    <div className="chem-display">
                      <img src={swipe ? hcl : nacl} alt="Acid" />
                      <span>{swipe ? 'HCl' : 'H2SO4'}</span>
                    </div>
                    <button className="arrow-btn" disabled={!swipe || !confirm} onClick={() => setSwipe(false)}>&gt;</button>
                  </div>
                </div>

                <div className="selection-row" style={{ marginTop: '15px' }}>
                  <span className="selection-label">BASE:</span>
                  <div className="chem-selector">
                    <div className="chem-display">
                      <img src={AB} alt="Base" />
                      <span>NaOH</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="sci-fi-btn" disabled={!confirm} onClick={setting_up_exp}>
                CONFIRM SELECTION
              </button>

              <button className="sci-fi-btn" disabled={!add_acid} onClick={() => {
                setAcid("M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V 644.637H226.348Z");
                setAddAcid(false);
                setKMN(true);
              }}>
                ADD 10ML ACID
              </button>

              <button className="sci-fi-btn" disabled={!add_kmn} onClick={() => {
                setKMN(false);
                setDrop(true);
                setShake(true);
              }}>
                ADD INDICATOR (KMnO4)
              </button>

              <button className="sci-fi-btn" onClick={() => window.location.reload()}>
                RESET EXPERIMENT
              </button>
            </div>
          </div>

          <div className="note-box">
            <span style={{ fontWeight: 'bold', color: '#ff4d4d' }}>NOTE:</span> The solution of HCl is 1 M and H2SO4 is 2 M.
            {message && <div style={{ color: '#00f3ff', marginTop: '10px' }}>{message}</div>}
          </div>
        </div>

        {/* Right Experiment Area */}
        <div className="titration-experiment-area">
          {/* Visual Setup */}
          <div className="setup-container">
            <div style={{ position: 'absolute', top: '100px', left: '100px' }}>
              <Polygon c={count} />
            </div>

            {/* Simulated SVG parts from original code, wrapped for positioning */}
            <div style={{ position: 'relative', transform: 'translateX(-50px)' }}>
              <TitrationSetup aheigth={acid_heigth} color={sColor} shaky={shaking} count={count} />

              {/* Dynamic Liquid Levels Overlay */}
              <div className="base_box" style={{
                height: `${210 - (count / 10) * 21}px`,
                left: '0',
                bottom: '0',
                position: 'absolute',
                transform: 'translate(928px, 118px)', // Kept original logic but might need tweaking
                display: 'none' // Hidden for now as it relies on hardcoded absolute pixels in original
              }}></div>
            </div>

            {/* Operating Buttons - Floating Action Buttons */}
            <div className="operating-buttons">
              <button className="op-btn" disabled={!drop} onClick={handleStart}>
                DROP
              </button>
              <button className="op-btn" disabled={!stopp} onClick={handleStop}>
                STOP
              </button>
              <button className="op-btn" disabled={!shake} onClick={handleShake}>
                SHAKE
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Titration;
