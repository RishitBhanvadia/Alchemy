import PropTypes from 'prop-types';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, FlaskConical, Check } from 'lucide-react';

const RoleCard = ({ role, selected, onSelect }) => {
  const isStudent = role === 'student';
  const Icon = isStudent ? GraduationCap : FlaskConical;
  const title = isStudent ? 'Student' : 'Teacher';
  const description = isStudent 
    ? 'Explore experiments and join classrooms.' 
    : 'Manage labs and track student progress.';
  const iconColor = isStudent ? '#a78bfa' : '#06b6d4';

  return (
    <motion.div
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.12)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(role)}
      className={`relative flex-1 cursor-pointer p-5 rounded-2xl border transition-all duration-300 text-center group ${
        selected 
        ? 'bg-lab-purple/10 border-lab-purple/70 shadow-lab-role-selected' 
        : 'bg-lab-input border-white/5'
      }`}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-3 right-3 w-2 h-2 bg-lab-purple rounded-full shadow-[0_0_10px_#7c3aed]"
          />
        )}
      </AnimatePresence>

      <div className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
        selected ? 'bg-lab-purple/25' : 'bg-lab-purple/12'
      }`}>
        <Icon 
          size={22} 
          style={{ color: selected ? '#a78bfa' : iconColor }} 
          className="transition-colors duration-300"
        />
      </div>

      <h3 className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
        selected ? 'text-lab-purple-soft' : 'text-white'
      }`}>
        {title}
      </h3>
      <p className="text-[12px] text-lab-muted leading-tight font-medium">
        {description}
      </p>
    </motion.div>
  );
};

export default RoleCard;

RoleCard.propTypes = {
  role: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};
