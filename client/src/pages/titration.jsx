import React, { useState, useEffect, useMemo } from "react";
import TitrationSetup from "../components/titration_setup";
import "./titration.css";

const Titration = () => {
    const [h, setH] = useState(0); // Height of the liquid in the burette
    const [shaky, setShaky] = useState(false); // Shake animation state
    const [count, setCount] = useState(0); // Drop count
    const [isDropping, setIsDropping] = useState(false); // Controls the dropping process

    useEffect(() => {
        let interval;
        if (isDropping && count < 100) {
            interval = setInterval(() => {
                setCount((prevCount) => {
                    const newCount = prevCount + 1;
                    if (newCount >= 100) {
                        setIsDropping(false); // Stop dropping when complete
                    }
                    return newCount;
                });
                setH((prevH) => prevH + 1); // Adjust height increment as needed
            }, 100); // Speed of drops
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isDropping, count]);

    // Derived state for color instead of using effect
    const color = useMemo(() => {
        if (count >= 30 && count < 60) {
            return '#ffcccc'; // Light pink
        } else if (count >= 60 && count < 90) {
            return '#ff9999'; // Darker pink
        } else if (count >= 90) {
            return '#ff6666'; // Red
        } else {
            return '#E0E0F6'; // Default
        }
    }, [count]);

    const handleStart = () => {
        if (count < 100) {
            setIsDropping(true);
        }
    };

    const handleStop = () => {
        setIsDropping(false);
    };

    const handleReset = () => {
        setIsDropping(false);
        setCount(0);
        setH(0);
        setShaky(false);
    };

    const handleShake = () => {
        setShaky(true);
        setTimeout(() => setShaky(false), 500); // Shake for 500ms
    };

    const liquidPath = `M280.72 ${437 - h * 0.5}H309.606V459.234H280.72Z`; // Dummy dynamic path

    return (
        <div className="titration-page">
            <h1 className="neon-text">TITRATION EXPERIMENT</h1>

            <div className="titration-container glass-panel">
                <div className="visualization-area">
                    <TitrationSetup
                        aheigth={liquidPath}
                        color={color}
                        shaky={shaky}
                        count={count}
                    />
                </div>

                <div className="controls-area">
                    <div className="stats-panel">
                        <div className="stat-row">
                            <span>DROPS:</span>
                            <span className="neon-value">{count}</span>
                        </div>
                        <div className="stat-row">
                            <span>VOLUME:</span>
                            <span className="neon-value">{(count * 0.05).toFixed(2)} mL</span>
                        </div>
                        <div className="stat-row">
                            <span>STATUS:</span>
                            <span className={`status-indicator ${isDropping ? 'active' : ''}`}>
                                {isDropping ? 'TITRATING' : 'IDLE'}
                            </span>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            className="cyber-button start-btn"
                            onClick={handleStart}
                            disabled={isDropping || count >= 100}
                        >
                            START
                        </button>
                        <button
                            className="cyber-button stop-btn"
                            onClick={handleStop}
                            disabled={!isDropping}
                        >
                            STOP
                        </button>
                        <button
                            className="cyber-button shake-btn"
                            onClick={handleShake}
                            disabled={isDropping}
                        >
                            SHAKE
                        </button>
                        <button
                            className="cyber-button reset-btn"
                            onClick={handleReset}
                        >
                            RESET
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Titration;