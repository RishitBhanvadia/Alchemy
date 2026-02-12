import React, { useState } from "react";
import { Link } from "react-router-dom";
import { practicals } from "../data/practicals";
import "./dashboard.css";

const Dashboard = () => {
    const [selectedClass, setSelectedClass] = useState('All');

    const filteredPracticals = selectedClass === 'All'
        ? practicals
        : practicals.filter(p => p.class === selectedClass);

    return (
        <div className="dashboard-page scene_element scene_element--fadein">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="neon-glow">WELCOME, SCHOLAR</h1>
                    <p className="subtitle">Select a module or browse practicals by class</p>
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

                <div className="practicals-section">
                    <h2 className="section-title">STANDARD PRACTICALS</h2>

                    <div className="class-filter">
                        {['All', '10', '11', '12'].map(cls => (
                            <button
                                key={cls}
                                className={`filter-btn ${selectedClass === cls ? 'active' : ''}`}
                                onClick={() => setSelectedClass(cls)}
                            >
                                {cls === 'All' ? 'ALL CLASSES' : `CLASS ${cls}`}
                            </button>
                        ))}
                    </div>

                    <div className="practicals-list">
                        {filteredPracticals.map((group, index) => (
                            <div key={index} className="practical-group glass-panel">
                                <div className="group-header">
                                    <span className="class-badge">Class {group.class}</span>
                                    <h3>{group.category}</h3>
                                </div>
                                <div className="experiments-grid">
                                    {group.experiments.map(exp => (
                                        <div key={exp.id} className="experiment-card">
                                            <h4>{exp.title}</h4>
                                            <p>{exp.description}</p>
                                            <Link to="/lab" className="start-btn">START PRACTICAL</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
