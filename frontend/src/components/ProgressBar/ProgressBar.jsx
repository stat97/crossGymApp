import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProgressBar.css';

export const ProgressBar = ({ steps }) => {
  const location = useLocation();

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);
  const progressPercentage = currentStepIndex >= 0 
    ? ((currentStepIndex + 1) / steps.length) * 100 
    : 0;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

// Definición de PropTypes
ProgressBar.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
