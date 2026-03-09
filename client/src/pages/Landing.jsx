import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import logo from '../assets/logo.png';

const LandingScene = lazy(() => import('../components/3d-animations/LandingScene'));

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <Suspense fallback={<div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }} />}>
                <LandingScene />
            </Suspense>

            <div className="landing-content">
                <img src={logo} alt="Alchemistry Logo" style={{ height: '120px', marginBottom: '20px' }} />
                <h1 className="landing-title">ALCHEMISTRY</h1>
                <p className="landing-subtitle">Experience the Magic of Digital Chemistry</p>
                <button className="start-button" onClick={() => navigate('/login')}>
                    ENTER LAB
                </button>
            </div>
        </div>
    );
};

export default Landing;
