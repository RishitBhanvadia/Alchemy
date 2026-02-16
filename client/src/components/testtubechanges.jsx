import React from "react";
import PropTypes from 'prop-types';
import CustomTestTube from "./testtube";

const TestTubeChanges = ({ arr }) => {
    return (
        <div className="test-tube-changes">
            {arr.map((item, index) => (
                <CustomTestTube key={index} color={item} hasLiquid={true} />
            ))}
        </div>
    );
};

TestTubeChanges.propTypes = {
    arr: PropTypes.arrayOf(PropTypes.string)
};

export default TestTubeChanges;
