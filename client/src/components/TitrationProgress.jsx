import React from 'react';
import PropTypes from 'prop-types';
import './TitrationProgress.css';

const TitrationProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Select' },
    { id: 2, label: 'Add Acid' },
    { id: 3, label: 'Indicator' },
    { id: 4, label: 'Titrate' },
  ];

  return (
    <div className="titration-progress-container">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div
            key={step.id}
            className={`step-item ${isActive ? 'active' : ''} ${
              isCompleted ? 'completed' : ''
            }`}
          >
            <div className="step-circle">
              {isCompleted ? (
                <span className="check-icon">✓</span>
              ) : (
                step.id
              )}
            </div>
            <span className="step-label">{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

TitrationProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default TitrationProgress;
