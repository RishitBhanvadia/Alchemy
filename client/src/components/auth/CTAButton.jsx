import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight,  UserPlus, Atom } from 'lucide-react';

const CTAButton = ({ children, onClick, loading, type = 'submit', icon: IconType }) => {
  const Icon = IconType === 'UserPlus' ? UserPlus : ArrowRight;

  return (
    <motion.button
      whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(124,58,237,0.7)' }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`relative w-full h-[52px] bg-ion-gradient rounded-[14px] text-white font-bold text-sm tracking-[0.08em] uppercase flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 shadow-lab-button group ${
        loading ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
      }`}
    >
      {/* Inner glow highlight */}
      <div className="absolute inset-0 border-t border-white/20 rounded-[14px] pointer-events-none" />
      
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Atom size={20} className="text-white" />
        </motion.div>
      ) : (
        <>
          {children}
          <Icon className="group-hover:translate-x-1.5 transition-transform duration-300" size={18} />
        </>
      )}

      {/* Shimmer effect for loading state */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
      )}
    </motion.button>
  );
};

export default CTAButton;
