import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loader-container">
        <div className="loader-beaker">
          <div className="liquid"></div>
          <div className="bubbles">
            <span className="bubble"></span>
            <span className="bubble"></span>
            <span className="bubble"></span>
          </div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </motion.div>
  );
};

LoadingOverlay.propTypes = {
  message: PropTypes.string,
};

export default LoadingOverlay;
