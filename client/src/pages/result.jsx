import React from "react";
import { useLocation, Navigate, NavLink } from "react-router-dom";
// import labgif from '../assets/labgigbl.gif';
import InExpResult from "../components/InExpResult";
import ExpResult from "./experiment_result";
import "./result.css";
// import back from '../assets/back.jpg';

const Result = () => {
    const location = useLocation();

    // Redirect if no state (direct access protection)
    if (!location.state) {
        return <Navigate to="/lab" replace />;
    }

    const { chemA, chemB, chemC, chemD } = location.state;

    // Logic to determine result based on inputs
    const calculateResult = () => {
        // Simplified logic mapping
        if (chemA > 0 && chemB > 0) return 0;
        if (chemA > 0 && chemC > 0) return 1;
        if (chemA > 0 && chemD > 0) return 2;
        if (chemB > 0 && chemC > 0) return 3;
        if (chemB > 0 && chemD > 0) return 4;
        if (chemC > 0 && chemD > 0) return 5;
        if (chemA > 0) return 6;
        if (chemB > 0) return 7;
        if (chemC > 0) return 8;
        if (chemD > 0) return 9;
        return 10; // Default
    };

    const resultIndex = calculateResult();

    return (
        <div className="result-page scene_element scene_element--fadein">
            <NavLink to="/lab" className="back-btn">
                <i className="fa-solid fa-arrow-left"></i> RETURN TO LAB
            </NavLink>

            <div className="result-container glass-panel">
                <h2 className="neon-text">EXPERIMENT RESULT</h2>
                <div className="result-display">
                    {/* Render different result components based on logic */}
                    {/* This is a placeholder for actual complex logic */}
                    {resultIndex < 5 ? (
                        <ExpResult num={resultIndex} on={false} />
                    ) : (
                        <InExpResult num={resultIndex} on={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Result;
