import React from 'react';
import { motion } from 'framer-motion';
import './EmptyState.css';

const EmptyState = ({ 
  icon,
  title = 'Nothing here yet', 
  description = 'There is nothing to display at the moment.',
  actionLabel = '',
  onAction = null,
  className = ''
}) => {
  let displayIcon = icon;

  if (!displayIcon) {
    const textContext = `${title} ${description}`.toLowerCase();
    if (textContext.includes('student') || textContext.includes('class')) {
      displayIcon = '👨‍🎓';
    } else if (textContext.includes('experiment') || textContext.includes('lab') || textContext.includes('result')) {
      displayIcon = '⚗️';
    } else if (textContext.includes('score') || textContext.includes('analytic') || textContext.includes('data')) {
      displayIcon = '📊';
    } else if (textContext.includes('classroom')) {
      displayIcon = '🏫';
    } else {
      displayIcon = '📭';
    }
  }

  return (
    <motion.div 
      className={`empty-state-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="empty-state-icon">{displayIcon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
