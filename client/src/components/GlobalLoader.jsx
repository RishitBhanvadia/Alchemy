import React from 'react';
import './GlobalLoader.css';

const GlobalLoader = () => {
  return (
    <div className="global-loader" role="status" aria-label="Loading application">
      <div className="loader-content">
        <div className="atom-spinner">
          <div className="electron"></div>
          <div className="electron"></div>
          <div className="electron"></div>
          <div className="nucleus"></div>
        </div>
        <p className="loading-text neon-pulse">INITIALIZING LAB...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
