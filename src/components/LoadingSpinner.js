import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  );
}

export default LoadingSpinner;
