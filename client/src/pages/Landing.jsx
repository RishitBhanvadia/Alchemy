/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import logo from '../assets/logo.png';
import CanvasContainer from '../components/3d-animations/CanvasContainer';
import FloatingMolecule from '../components/3d-animations/FloatingMolecule';
import { OrbitControls } from '@react-three/drei';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <CanvasContainer style={{ zIndex: 1 }}>
                <FloatingMolecule />
                <OrbitControls enableZoom={false} enablePan={false} />
            </CanvasContainer>

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
