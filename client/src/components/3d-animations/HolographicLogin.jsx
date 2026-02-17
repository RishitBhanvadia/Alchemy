import React from 'react';
const HolographicLogin = ({ children }) => {
    return (
        <div className="login-card tilt-card" style={{
            background: 'rgba(255, 255, 255, 0.33)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
            {children}
        </div>
    );
};

export default HolographicLogin;
