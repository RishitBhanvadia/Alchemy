import React from 'react';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';

const HolographicLogin = ({ children }) => {
    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={1000}
            scale={1.02}
            className="holographic-login-container"
        >
            <div className="holographic-glass-panel">
                {children}
            </div>
        </Tilt>
    );
};

HolographicLogin.propTypes = {
    children: PropTypes.node
};

export default HolographicLogin;
