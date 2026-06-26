import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

const AuthCard = ({ children }) => {
  return (
    <div className="w-full max-w-[440px] px-4 md:px-0">
      <div className="bg-lab-card rounded-[24px] border border-white/7 shadow-lab-card p-[40px_36px] relative overflow-hidden backdrop-blur-md">
        
        {/* Inner top glow */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-lab-purple/40 to-transparent" />
        
        {/* Logo & Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-[56px] h-[56px] rounded-xl bg-lab-purple/10 border border-lab-purple/20 shadow-[0_0_25px_rgba(124,58,237,0.15)] flex items-center justify-center mb-4 group relative"
          >
            {/* Inner flask light source effect (glowing liquid) */}
            <div className="absolute inset-[14px] bg-ion-gradient rounded-full blur-[14px] opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
            
            <FlaskConical 
              size={30} 
              className="text-white relative z-10 fill-lab-purple/20 transition-all duration-500 group-hover:fill-lab-cyan/30" 
            />
          </motion.div>
          
          <h1 className="text-[34px] font-bold tracking-tight mb-1 font-display">
            <span className="text-white">AI</span>
            <span className="text-lab-purple-soft">chemistry</span>
          </h1>
          
          <p className="text-[10px] font-semibold text-lab-muted tracking-[0.25em] uppercase opacity-80">
            The Virtual Chemistry Lab
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};


AuthCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthCard;
