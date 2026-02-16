import React from "react";
import PropTypes from 'prop-types';
import labgif from '../assets/labgigbl.gif';

const InExpResultComponent = ({ num, on }) => {
    // Placeholder implementation based on lint errors (prop types missing, unused vars)
    return (
        <div>
            {on ? (
                <div className="load_div">
                    <img src={labgif} alt="Loading..." />
                </div>
            ) : (
                <div>Result ID: {num}</div>
            )}
        </div>
    );
};

InExpResultComponent.propTypes = {
    num: PropTypes.number,
    on: PropTypes.bool
};

export default InExpResultComponent;
