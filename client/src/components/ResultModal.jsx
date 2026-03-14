import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './ResultModal.css';

/**
 * ResultModal Component
 * Displays the reaction outcome with modern UI components.
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {object} result - Reaction result data from backend
 * @param {function} onReset - Callback to reset the lab
 * @param {function} onClose - Callback to close modal without reset
 * @param {function} onAskAI - Callback to open AI tutor with context
 */
const ResultModal = ({ isOpen, result, onReset, onClose, onAskAI }) => {
  if (!isOpen || !result) return null;

  const { outcome, result_formula, product_info, product_name } = result;

  // Determine safety level for badges
  const getSafetyLevel = (outcomeStr) => {
    const dangerKeywords = ['Explosion', 'Vigorous', 'Danger', 'Toxic'];
    const cautionKeywords = ['Precipitate', 'Gas', 'Heat', 'Change'];
    
    if (dangerKeywords.some(kw => outcomeStr?.includes(kw))) return 'danger';
    if (cautionKeywords.some(kw => outcomeStr?.includes(kw))) return 'caution';
    return 'safe';
  };

  const safetyLevel = getSafetyLevel(outcome || product_name);

  return (
    <AnimatePresence>
      <motion.div 
        className="result-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="result-modal-content"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="result-modal-header">
            <h2 className="neon-glow">Reaction Complete</h2>
            <div className={`result-badge badge-${safetyLevel}`}>
              {safetyLevel === 'danger' ? '⚠️ Dangerous' : safetyLevel === 'caution' ? '⚡ Caution' : '✅ Safe'}
            </div>
          </div>

          <div className="result-modal-body">
            <h3 className="outcome-name">{outcome || product_name}</h3>
            <p className="outcome-description">
              {product_info || "The chemicals have interacted to produce this result. Observe the physical changes in the beaker."}
            </p>

            {(result_formula || result.result) && (
              <div className="formula-box">
                <span className="formula-label">Chemical Equation</span>
                <span className="formula-text">{result_formula || result.result}</span>
              </div>
            )}
          </div>

          <div className="result-modal-footer">
            <button className="modal-btn btn-ai" onClick={onAskAI}>
              <span>🤖</span> Ask AI Tutor for Explanation
            </button>
            <div className="footer-actions-row">
              <button className="modal-btn btn-secondary" onClick={onClose}>
                Keep Experiment
              </button>
              <button className="modal-btn btn-reset" onClick={onReset}>
                Reset Lab
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ResultModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  result: PropTypes.shape({
    outcome: PropTypes.string,
    result_formula: PropTypes.string,
    product_info: PropTypes.string,
    product_name: PropTypes.string,
    result: PropTypes.string
  }),
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAskAI: PropTypes.func.isRequired
};

export default ResultModal;
