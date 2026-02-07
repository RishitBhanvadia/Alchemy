import React from 'react';
import Tilt from 'react-parallax-tilt';

const HolographicLogin = ({ children }) => {
    return (
        <Tilt
            className="tilt-wrapper"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            gyroscope={true}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="15px"
        >
            <div className="login-card tilt-card" style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
                {children}
            </div>
        </Tilt>
    );
};

export default HolographicLogin;
