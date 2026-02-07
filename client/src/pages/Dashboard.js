import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import './dashboard.css';
import back from '../assets/back.jpg';
import CanvasContainer from '../components/3d-animations/CanvasContainer';
import ParticleBackground from '../components/3d-animations/ParticleBackground';

const Dashboard = () => {
    const navigate = useNavigate();

    const experiments = [
        { title: "Acid-Base Titration", icon: "fa-flask", status: "Completed", path: "/titration" },
        { title: "Organic Synthesis", icon: "fa-atom", status: "In Progress", path: "/organic" },
        { title: "Inorganic Analysis", icon: "fa-vial", status: "Not Started", path: "/inorganic" },
        { title: "General Lab", icon: "fa-flask-vial", status: "Available", path: "/lab" },
    ];

    return (
        <div className="dashboard-page">
            <Sidebar />

            {/* Background text image effect like in lab.js */}
            <img className="school" src={back} alt="" style={{ opacity: 0.05 }} />

            {/* 3D Particle Background Wrapper */}
            <CanvasContainer style={{ zIndex: 1 }}>
                <ParticleBackground />
            </CanvasContainer>

            <div className="dashboard-content">
                <div className="welcome-header">
                    <div className="user-greeting">
                        <h1>WELCOME BACK, SCIENTIST</h1>
                        <p>Your laboratory assumes you are ready to experiment.</p>
                    </div>
                    <div className="stats-container">
                        <div className="stat-box">
                            <div className="stat-number">4</div>
                            <div className="stat-label">Modules</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">12</div>
                            <div className="stat-label">Hours</div>
                        </div>
                    </div>
                </div>

                <h2 style={{ fontFamily: 'Montserrat', marginBottom: '20px', color: 'var(--text-white)' }}>Available Experiments</h2>

                <div className="experiments-grid">
                    {experiments.map((exp, index) => (
                        <div
                            key={index}
                            className="experiment-card"
                            onClick={() => navigate(exp.path)}
                        >
                            <div className="card-icon">
                                <i className={`fa-solid ${exp.icon}`}></i>
                            </div>
                            <div className="card-title">{exp.title}</div>
                            <div className="card-status">{exp.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
