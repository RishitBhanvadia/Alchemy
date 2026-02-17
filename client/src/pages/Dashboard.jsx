import React from "react";
import { Link } from "react-router-dom";

import "./dashboard.css";
// import ParticlesBg from "../components/ParticlesBg"; // Global theme handles bg now

const Dashboard = () => {
    return (
        <div className="dashboard-page scene_element scene_element--fadein">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="neon-glow">WELCOME, ADMIN</h1>
                    <p className="subtitle">Select a module to begin experimentation</p>
                </div>

                <div className="module-grid">
                    {/* Experiment Module */}
                    <Link to="/lab" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-flask"></i>
                        </div>
                        <h3>LABORATORY</h3>
                        <p>Conduct virtual chemical reactions.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Titration Module */}
                    <Link to="/titration" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-flask-vial"></i>
                        </div>
                        <h3>TITRATION</h3>
                        <p>Precise volumetric analysis.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Organic Module */}
                    <Link to="/organic" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-dna"></i>
                        </div>
                        <h3>ORGANIC</h3>
                        <p>Explore carbon-based chemistry.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Inorganic Module */}
                    <Link to="/inorganic" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-atom"></i>
                        </div>
                        <h3>INORGANIC</h3>
                        <p>Study elements and compounds.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* History/Logs */}
                    <Link to="/history" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <h3>HISTORY</h3>
                        <p>Review past experiment logs.</p>
                        <div className="card-glow"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    // No props currently, but ready for future additions
};

export default Dashboard;
