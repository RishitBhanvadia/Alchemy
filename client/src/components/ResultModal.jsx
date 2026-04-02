import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  // Reset confirmation state when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setShowConfirmReset(false);
    }
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const { 
    outcome_label, 
    product_formula, 
    color, 
    state_change, 
    thermal_effect, 
    is_dangerous 
  } = result;

  const dangerBadge = is_dangerous
    ? { label: '⚠️ DANGEROUS', className: 'badge-danger' }
    : { label: '✅ SAFE', className: 'badge-safe' };

  const thermalIcon = thermal_effect?.includes('Exothermic') ? '🔥' : thermal_effect?.includes('Endothermic') ? '❄️' : '💧';
  const stateIcon = state_change?.includes('Gas') ? '💨' 
    : state_change?.includes('Precipitate') ? '🌧️' 
    : state_change?.includes('Colour') ? '🎨' : '💧';

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
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="result-modal-header">
            <h2 className="neon-glow">Reaction Complete</h2>
            <div className={`result-badge ${dangerBadge.className}`}>
              {dangerBadge.label}
            </div>
          </div>

          <div className="result-modal-body" data-testid="observation-panel">
            <h3 className="outcome-name" data-testid="reaction-result">{outcome_label}</h3>
            
            <div className="result-stats">
              {thermal_effect && (
                <div className="stat-item" title="Thermal Effect">
                  <span className="stat-icon">{thermalIcon}</span>
                  <span className="stat-text">{thermal_effect}</span>
                </div>
              )}
              {state_change && (
                <div className="stat-item" title="State Change">
                  <span className="stat-icon">{stateIcon}</span>
                  <span className="stat-text">{state_change}</span>
                </div>
              )}
            </div>

            {product_formula && (
              <div className="formula-box">
                <span className="formula-label">Chemical Result</span>
                <span className="formula-text">{product_formula}</span>
                {color && <div className="color-preview" style={{ backgroundColor: color.toLowerCase().replace(/fading to/, '').trim() }} title={`Observed Color: ${color}`}></div>}
              </div>
            )}
          </div>

          <div className="result-modal-footer">
            {showConfirmReset ? (
              <div className="confirm-prompt">
                <p className="confirm-text">Are you sure you want to reset? This will clear your current experiment.</p>
                <div className="footer-actions-row">
                  <button className="modal-btn btn-secondary" onClick={() => setShowConfirmReset(false)}>
                    Cancel
                  </button>
                  <button className="modal-btn btn-confirm-reset" onClick={() => {
                    setShowConfirmReset(false);
                    onReset();
                  }}>
                    Yes, Reset
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button className="modal-btn btn-ai" onClick={onAskAI}>
                  <span>🤖</span> Ask AI Tutor for Explanation
                </button>
                <div className="footer-actions-row">
                  <button className="modal-btn btn-secondary" onClick={onClose}>
                    Keep Experiment
                  </button>
                  <button className="modal-btn btn-reset" onClick={() => setShowConfirmReset(true)}>
                    Reset Lab
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultModal;
