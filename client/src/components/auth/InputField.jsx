/* eslint-disable react/prop-types */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, onBlur, error, name, disabled }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-[11px] font-medium text-lab-muted tracking-[0.1em] uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
          error ? 'text-red-500/60' : 'text-lab-muted group-focus-within:text-lab-purple'
        }`}>
          <Icon size={18} />
        </div>
        <input
          type={type}
          name={name}
          id={name}
          disabled={disabled}
          className={`w-full bg-lab-input border rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder-lab-placeholder outline-none transition-all duration-200 ${
            error 
            ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
            : 'border-white/5 focus:border-lab-purple/60 focus:shadow-lab-input-focus group-hover:border-white/10'
          } ${value && !error ? 'border-lab-cyan/40' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] text-red-400 font-medium ml-1 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;
