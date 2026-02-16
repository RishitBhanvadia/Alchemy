import React from "react";
import PropTypes from 'prop-types';

const CustomTestTube = ({ color, hasLiquid }) => {
    return (
        <div className="test-tube-component" style={{ backgroundColor: hasLiquid ? color : 'transparent' }}>
            {/* Visual representation */}
        </div>
    );
};

CustomTestTube.propTypes = {
    color: PropTypes.string,
    hasLiquid: PropTypes.bool
};

export default CustomTestTube;
