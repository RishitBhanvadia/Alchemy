import React from 'react';
import PropTypes from 'prop-types';

const HolographicLogin = ({ children }) => {
    return (
        <div style={{
            position: 'relative',
            padding: '40px',
            background: 'rgba(0, 20, 40, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
                animation: 'scanline 2s linear infinite'
            }} />

            {children}

            <style>
                {`
                    @keyframes scanline {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(500px); }
                    }
                `}
            </style>
        </div>
    );
};

HolographicLogin.propTypes = {
    children: PropTypes.node
};

export default HolographicLogin;