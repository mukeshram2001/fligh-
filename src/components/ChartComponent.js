// src/components/ChartComponent.js
import React from 'react';

function ChartComponent({ flightData, delayPrediction }) {
  // In a real implementation, you might use historical data related to the flight route
  // or airport to display relevant charts (e.g., using Chart.js).

  if (!flightData) {
    // return <p>Charts will be displayed here once flight data is available.</p>;
    return null;
  }

  return (
    <div className="chart-placeholder">
      <h4>Delay Statistics Chart</h4>
      <p>
        Current Predicted Risk: {(delayPrediction * 100).toFixed(0)}%
      </p>
      <div style={{ height: '150px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
        [Chart Placeholder - e.g., Chart.js integration]
      </div>
      <p><small>A chart showing historical delay trends for this route or airport could be displayed here.</small></p>
    </div>
  );
}

export default ChartComponent;
