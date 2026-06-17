import React from 'react';
import { motion } from 'framer-motion';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = "Connecting to Lab..." }) => {
    return (
        <motion.div 
            className="loading-overlay"
            data-testid="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loading-content">
                <div className="beaker-loader">
                    <div className="liquid"></div>
                </div>
                <motion.h2
                    animate={{ 
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                    }}
                >
                    {message}
                </motion.h2>
                <div className="loading-bar-container">
                    <motion.div 
                        className="loading-bar"
                        animate={{ 
                            width: ["0%", "100%"] 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingOverlay;
