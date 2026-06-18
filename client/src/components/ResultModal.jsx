import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './ResultModal.css';

const ResultModal = ({ isOpen, result, onReset, onClose, onAskAI }) => {
  if (!isOpen || !result) return null;

  // Determine styling based on outcome
  const isSuccess = result.outcome_label === 'Success';
  const isDanger = result.outcome_label === 'Danger' || result.is_dangerous;
  const isNeutral = !isSuccess && !isDanger;

  const headerClass = isSuccess ? 'result-success' : isDanger ? 'result-danger' : 'result-neutral';

  // Format state changes and thermal effects for better display
  const hasThermalEffect = result.thermal_effect && result.thermal_effect !== 'None';
  const isExothermic = result.thermal_effect && result.thermal_effect.includes('Exothermic');
  const isEndothermic = result.thermal_effect && result.thermal_effect.includes('Endothermic');
  const isGasProduced = result.state_change && result.state_change.includes('Gas');
  const isPrecipitateProduced = result.state_change && (result.state_change.includes('Precipitate') || result.state_change.includes('Solid'));

  return (
    <AnimatePresence>
      <motion.div 
        className="result-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={`result-modal-content ${headerClass}`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button className="result-close-btn" onClick={onClose}>×</button>

          <div className="result-header">
            <h2>{result.outcome_label}</h2>
            <div className="result-product-formula">
              {result.product_formula || 'Unknown Product'}
            </div>
          </div>

          <div className="result-body">
            <div className="result-properties-grid">

              <div className="property-card">
                <span className="property-icon">🎨</span>
                <span className="property-label">Color</span>
                <span className="property-value capitalize">{result.color}</span>
              </div>

              <div className="property-card">
                <span className="property-icon">🔄</span>
                <span className="property-label">State</span>
                <span className="property-value">{result.state_change || 'No change'}</span>
              </div>

              <div className="property-card">
                <span className="property-icon">🌡️</span>
                <span className="property-label">Thermal</span>
                <span className={`property-value ${isExothermic ? 'text-red-400' : isEndothermic ? 'text-blue-400' : ''}`}>
                  {result.thermal_effect || 'None'}
                </span>
              </div>

              <div className="property-card">
                <span className="property-icon">⚠️</span>
                <span className="property-label">Safety</span>
                <span className={`property-value ${result.is_dangerous ? 'text-red-500 font-bold' : 'text-green-400'}`}>
                  {result.is_dangerous ? 'Dangerous' : 'Safe'}
                </span>
              </div>

            </div>

            {/* Visual Indicators */}
            <div className="visual-indicators">
              {hasThermalEffect && (
                <div className={`indicator-badge ${isExothermic ? 'badge-hot' : 'badge-cold'}`}>
                  {isExothermic ? '🔥 Generates Heat' : '❄️ Absorbs Heat'}
                </div>
              )}
              {isGasProduced && (
                <div className="indicator-badge badge-gas">
                  💨 Gas Evolution
                </div>
              )}
              {isPrecipitateProduced && (
                <div className="indicator-badge badge-solid">
                  🪨 Precipitate Formed
                </div>
              )}
              {/* Added dynamic color swatch if color is valid */}
              {result.color && result.color.toLowerCase() !== 'colorless' && result.color.toLowerCase() !== 'clear' && (
                 <div className="indicator-badge badge-color">
                   <span
                    className="color-swatch"
                    style={{ backgroundColor: result.color.toLowerCase().replace(' ', '') }}
                   ></span>
                   {result.color}
                 </div>
              )}
            </div>

            <p className="result-description">
              {result.description || "The reaction completed successfully according to the known chemical principles."}
            </p>
          </div>

          <div className="result-actions">
            <button className="btn-secondary" onClick={onReset}>
              Reset Equipment
            </button>
            <button className="btn-primary" onClick={onAskAI}>
              Ask AI Tutor
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ResultModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  result: PropTypes.shape({
    outcome_label: PropTypes.string,
    is_dangerous: PropTypes.bool,
    thermal_effect: PropTypes.string,
    state_change: PropTypes.string,
    product_formula: PropTypes.string,
    color: PropTypes.string,
    description: PropTypes.string,
  }),
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAskAI: PropTypes.func.isRequired,
};

export default ResultModal;
