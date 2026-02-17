import React, { useReducer, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { reducer } from "../utils/titrationUtils";
import { INITIAL_STATE } from "../utils/titrationConstants";
import TitrationSetup from "../components/titration_setup";
import "./titration.css";

const Titration = () => {
    // const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        let interval = null;
        if (state.sk && state.count < 100) {
            interval = setInterval(() => {
                dispatch({ type: "INCREMENT_COUNT" });
            }, 100);
        } else if (!state.sk && state.count !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [state.sk, state.count]);

    const handleSpeedChange = (e) => {
        dispatch({ type: "SET_SPEED", payload: e.target.value });
    };

    // const behnede = () => {
    //     // Logic
    // };

    return (
        <div className="titration-page scene_element scene_element--fadein">
            <div className="titration-container">
                <div className="setup-area">
                    <TitrationSetup
                        aheigth={state.aheigth}
                        color={state.color}
                        shaky={state.shaky}
                        count={state.count}
                    />
                </div>

                <div className="controls-area glass-panel">
                    <h2 className="neon-text">TITRATION CONTROL</h2>

                    <div className="control-group">
                        <label htmlFor="valve-btn">Valve Control</label>
                        <button
                            id="valve-btn"
                            className={`valve-btn ${state.sk ? 'active' : ''}`}
                            onClick={() => dispatch({ type: "TOGGLE_VALVE" })}
                        >
                            {state.sk ? "STOP FLOW" : "START FLOW"}
                        </button>
                    </div>

                    <div className="control-group">
                        <label htmlFor="flow-rate">Flow Rate</label>
                        <input
                            id="flow-rate"
                            type="range"
                            min="1"
                            max="10"
                            value={state.speed}
                            onChange={handleSpeedChange}
                            className="sci-fi-range"
                        />
                    </div>

                    <div className="status-display">
                        <div className="status-item">
                            <span>Volume:</span>
                            <span className="value">{state.count} mL</span>
                        </div>
                        <div className="status-item">
                            <span>Status:</span>
                            <span className={`value ${state.shaky ? 'warning' : 'normal'}`}>
                                {state.shaky ? "UNSTABLE" : "STABLE"}
                            </span>
                        </div>
                    </div>

                    <button
                        className="reset-btn"
                        onClick={() => dispatch({ type: "RESET" })}
                    >
                        RESET SYSTEM
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Titration;
