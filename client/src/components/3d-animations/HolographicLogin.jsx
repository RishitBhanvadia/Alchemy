/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import PropTypes from 'prop-types';
import Tilt from 'react-parallax-tilt';

const HolographicLogin = ({ children }) => {
    return (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
            <div className="login-card tilt-card" style={{
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
