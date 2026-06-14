import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const AuthPage = ({ children }) => {
  return (
    <div className="min-h-screen bg-lab-black relative overflow-hidden flex items-center justify-center p-4 selection:bg-lab-purple/30 font-sans antialiased">
      {/* Background radial nebula glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-lab-purple/15 rounded-full blur-[160px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-lab-cyan/10 rounded-full blur-[140px] pointer-events-none transition-all duration-1000" />
      
      {/* 30px Graph Grid Overlay (3% opacity) */}
      <div className="absolute inset-0 lab-grid opacity-[0.9] pointer-events-none" />
      
      {/* Atmospheric particulates / dust effect (subtle animation pool) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-1 h-1 bg-white/20 rounded-full blur-[1px] animate-float" />
        <div className="absolute bottom-[40%] right-[30%] w-0.5 h-0.5 bg-white/30 rounded-full blur-[1px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};

AuthPage.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthPage;
