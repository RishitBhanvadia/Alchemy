import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import logo from '../assets/logo.png';

// Lazy load heavy 3D components to prevent blocking the initial render
const CanvasContainer = lazy(() => import('../components/3d-animations/CanvasContainer'));
const FloatingMolecule = lazy(() => import('../components/3d-animations/FloatingMolecule'));
const OrbitControls = lazy(() => import('@react-three/drei').then(module => ({ default: module.OrbitControls })));

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <Suspense fallback={null}>
                <CanvasContainer style={{ zIndex: 1 }}>
                    <FloatingMolecule />
                    <OrbitControls enableZoom={false} enablePan={false} />
                </CanvasContainer>
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
