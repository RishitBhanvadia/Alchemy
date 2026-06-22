/* eslint-disable react/prop-types */
import React from 'react';
import { motion } from 'framer-motion';

const TabSwitcher = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full h-[52px] bg-lab-black p-1.5 rounded-[18px] border border-white/8 flex mb-10 relative shadow-inner shadow-black/40">
      {/* Animated background slip */}
      <motion.div
        initial={false}
        animate={{ x: activeTab === 'login' ? 0 : '100.1%' }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] z-0 pointer-events-none"
      >
        <div className="w-full h-full bg-ion-gradient rounded-[12px] shadow-[0_4px_15px_rgba(124,58,237,0.35)] flex items-center justify-center">
           {/* Inner glass highlight for active tab */}
           <div className="absolute inset-0 border-t border-white/20 rounded-[12px] pointer-events-none" />
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => onTabChange('login')}
        className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
          activeTab === 'login' ? 'text-white' : 'text-lab-muted hover:text-lab-purple-soft'
        }`}
      >
        Log In
      </button>

      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
          activeTab === 'signup' ? 'text-white' : 'text-lab-muted hover:text-lab-purple-soft'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default TabSwitcher;
