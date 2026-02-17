import React, { useReducer, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import "./titration.css";
import Polygon from "../components/Polygon";
import TitrationSetup from "../components/titration_setup";
import hcl from "../assets/hc.png";
import nacl from '../assets/h2so4.png';
import AB from '../assets/ab.png';
import { TITRATION_DATA, ACID_PATH_TEMPLATE, INITIAL_COLOR } from '../utils/titrationConstants';
import { calculateAcidPath, calculateColor, calculateScore, getFeedbackMessage } from '../utils/titrationUtils';

const initialState = {
  isSetupConfirmed: false,
  isAcidAdded: false,
  isIndicatorAdded: false,
  isDropping: false,
  isShaking: false,
  swipe: true, // true for HCl, false for H2SO4
  acidPath: ACID_PATH_TEMPLATE.INITIAL,
  data: TITRATION_DATA[0],
  color: INITIAL_COLOR,
  count: 0,
  message: "",
};

function titrationReducer(state, action) {
  switch (action.type) {
    case 'SET_SWIPE':
      return {
        ...state,
        swipe: action.payload,
        data: action.payload ? TITRATION_DATA[0] : TITRATION_DATA[1]
      };
    case 'CONFIRM_SETUP':
      return {
        ...state,
        isSetupConfirmed: true
      };
    case 'ADD_ACID':
      return {
        ...state,
        isAcidAdded: true,
        acidPath: ACID_PATH_TEMPLATE.FILLED
      };
    case 'ADD_INDICATOR':
      return {
        ...state,
        isIndicatorAdded: true
      };
    case 'START_DROPPING':
      return {
        ...state,
        isDropping: true
      };
    case 'STOP_DROPPING':
      return {
        ...state,
        isDropping: false,
        message: action.message || state.message
      };
    case 'SHAKE_START':
      return { ...state, isShaking: true };
    case 'SHAKE_END':
      return { ...state, isShaking: false };
    case 'UPDATE_COUNT': {
      const newCount = state.count + 1;
      return {
        ...state,
        count: newCount,
        acidPath: calculateAcidPath(newCount)
      };
    }
    case 'UPDATE_COLOR': {
      const newColor = calculateColor(state.count, state.data);
      return {
        ...state,
        color: newColor || state.color
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const Titration = () => {
  const [state, dispatch] = useReducer(titrationReducer, initialState);

  const saveResultToDB = useCallback(async (finalCount, score) => {
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
              details: { volume_used: finalCount, acid: state.swipe ? 'HCl' : 'H2SO4' }
            }
          ]);
        if (error) {
             // Use a logger or handle error appropriately in production
             // eslint-disable-next-line no-console
             console.error('Error saving result:', error);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Supabase error:", e);
    }
  }, [state.swipe]);

  const handleStop = useCallback(() => {
    if (state.isDropping) {
      const score = calculateScore(state.count);
      const feedback = getFeedbackMessage(score);
      const message = `Score: ${score}/100. ${feedback}`;

      dispatch({ type: 'STOP_DROPPING', message });
      saveResultToDB(state.count, score);
    }
  }, [state.isDropping, state.count, saveResultToDB]);

  // Timer Logic
  useEffect(() => {
    let timerId;
    if (state.isDropping) {
        if (state.count < 100) {
             timerId = setInterval(() => {
                dispatch({ type: 'UPDATE_COUNT' });
              }, 100);
        } else {
             handleStop();
        }
    }
    return () => clearInterval(timerId);
  }, [state.isDropping, state.count, handleStop]);

  const handleStart = () => {
    if (!state.isDropping) {
      dispatch({ type: 'START_DROPPING' });
    }
  };

  const handleShake = () => {
    dispatch({ type: 'SHAKE_START' });
    setTimeout(() => dispatch({ type: 'SHAKE_END' }), 500);
    dispatch({ type: 'UPDATE_COLOR' });
  };

  // Helper variables for button states
  const canConfirm = !state.isSetupConfirmed;
  const canAddAcid = state.isSetupConfirmed && !state.isAcidAdded;
  const canAddIndicator = state.isAcidAdded && !state.isIndicatorAdded;
  const canDrop = state.isIndicatorAdded && !state.isDropping;
  const canStop = state.isDropping;
  const canShake = state.isIndicatorAdded;

  return (
    <div className="titration-page">
      <Navbar />

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
                    <button className="arrow-btn" disabled={state.swipe || !canConfirm} onClick={() => dispatch({ type: 'SET_SWIPE', payload: true })}>&lt;</button>
                    <div className="chem-display">
                      <img src={state.swipe ? hcl : nacl} alt="Acid" />
                      <span>{state.swipe ? 'HCl' : 'H2SO4'}</span>
                    </div>
                    <button className="arrow-btn" disabled={!state.swipe || !canConfirm} onClick={() => dispatch({ type: 'SET_SWIPE', payload: false })}>&gt;</button>
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

              <button className="sci-fi-btn" disabled={!canConfirm} onClick={() => dispatch({ type: 'CONFIRM_SETUP' })}>
                CONFIRM SELECTION
              </button>

              <button className="sci-fi-btn" disabled={!canAddAcid} onClick={() => dispatch({ type: 'ADD_ACID' })}>
                ADD 10ML ACID
              </button>

              <button className="sci-fi-btn" disabled={!canAddIndicator} onClick={() => dispatch({ type: 'ADD_INDICATOR' })}>
                ADD INDICATOR (KMnO4)
              </button>

              <button className="sci-fi-btn" onClick={() => window.location.reload()}>
                RESET EXPERIMENT
              </button>
            </div>
          </div>

          <div className="note-box">
            <span style={{ fontWeight: 'bold', color: '#ff4d4d' }}>NOTE:</span> The solution of HCl is 1 M and H2SO4 is 2 M.
            {state.message && <div style={{ color: '#00f3ff', marginTop: '10px' }}>{state.message}</div>}
          </div>
        </div>

        {/* Right Experiment Area */}
        <div className="titration-experiment-area">
          <div className="setup-container">
            <div style={{ position: 'absolute', top: '100px', left: '100px' }}>
              <Polygon c={state.count} />
            </div>

            <div style={{ position: 'relative', transform: 'translateX(-50px)' }}>
              <TitrationSetup aheigth={state.acidPath} color={state.color} shaky={state.isShaking} count={state.count} />
            </div>

            <div className="operating-buttons">
              <button className="op-btn" disabled={!canDrop} onClick={handleStart}>
                DROP
              </button>
              <button className="op-btn" disabled={!canStop} onClick={handleStop}>
                STOP
              </button>
              <button className="op-btn" disabled={!canShake} onClick={handleShake}>
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
