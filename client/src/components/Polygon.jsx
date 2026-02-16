import React from "react";
import PropTypes from 'prop-types';

const Polygon = ({ c }) => {
    // Implementation
    return (
        <svg>
            <text x="10" y="20">{c}</text>
        </svg>
    );
};

Polygon.propTypes = {
    c: PropTypes.number
};

export default Polygon;
