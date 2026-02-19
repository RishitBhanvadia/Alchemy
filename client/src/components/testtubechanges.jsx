import React from "react";
import PropTypes from 'prop-types';

const TestTubeChanges = ({ arr }) => {
    return (
        <div>
            {arr.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    {/* Placeholder for test tube changes */}
                    <span>Chemical added: {item}</span>
                </div>
            ))}
        </div>
    )
}

TestTubeChanges.propTypes = {
    arr: PropTypes.arrayOf(PropTypes.string)
};

export default TestTubeChanges;