import React from "react";
// import logo from '../assets/logo.png';
// import back from '../assets/back.jpg';
import { NavLink } from "react-router-dom";
import "./organic.css"

const Organic = () => {
    return (
        <div className="organic-page scene_element scene_element--fadein">
            <NavLink to="/dashboard" className="back-btn">
                <i className="fa-solid fa-arrow-left"></i> BACK
            </NavLink>
            <div className="organic-container">
                <h1 className="neon-text">ORGANIC CHEMISTRY</h1>
                <p className="description">Explore the reactions of carbon compounds.</p>

                <div className="experiment-list glass-panel">
                    <div className="experiment-item">
                        <h3>Functional Group Analysis</h3>
                        <p>Identify functional groups in organic compounds.</p>
                        <button className="start-btn">COMING SOON</button>
                    </div>
                    <div className="experiment-item">
                        <h3>Synthesis Reactions</h3>
                        <p>Create esters and polymers.</p>
                        <button className="start-btn">COMING SOON</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Organic;
