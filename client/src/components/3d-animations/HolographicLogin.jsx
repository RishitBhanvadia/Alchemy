import React from 'react';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';

const HolographicLogin = ({ children }) => {
    return (
        <Tilt
            className="tilt-card"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1500}
        >
            <div className="login-card" style={{
                background: 'rgba(255, 255, 255, 0.33)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
                {children}
            </div>
        </Tilt>
    );
};

HolographicLogin.propTypes = {
    children: PropTypes.node
};

export default HolographicLogin;
