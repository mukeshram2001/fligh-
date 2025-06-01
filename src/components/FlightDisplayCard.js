import React from 'react';
import './FlightDisplayCard.css';

function FlightDisplayCard({ flightData, delayPrediction }) {
  if (!flightData) {
    return null; // Don't render if no data
  }

  const getRiskColor = (probability) => {
    if (probability < 0.3) return 'green';
    if (probability < 0.6) return 'yellow';
    return 'red';
  };

  const delayPercentage = delayPrediction !== null ? (delayPrediction * 100).toFixed(0) : 'N/A';
  const riskColor = delayPrediction !== null ? getRiskColor(delayPrediction) : 'grey';

  return (
    <div className={`flight-display-card ${riskColor}-risk`}>
      <h3>Flight Details</h3>
      <p><strong>Flight:</strong> {flightData.flightDetails?.airline} {flightData.flightDetails?.flightNumber}</p>
      <p><strong>Origin:</strong> {flightData.flightDetails?.origin}</p>
      <p><strong>Destination:</strong> {flightData.flightDetails?.destination}</p>
      <p><strong>Scheduled Departure:</strong> {flightData.flightDetails?.scheduledDeparture || 'N/A'}</p>
      <p><strong>Scheduled Arrival:</strong> {flightData.flightDetails?.scheduledArrival || 'N/A'}</p>

      <h4>Live Status</h4>
      <p>{flightData.liveStatus?.currentStatus || 'Not available'}</p>

      <h4>Delay Prediction</h4>
      <div className="delay-probability-display">
        <span className={`probability-value color-${riskColor}`}>
          {delayPercentage}%
        </span>
        <span className="probability-label">Predicted Delay Risk</span>
      </div>

      {/* Placeholder for more detailed data if needed */}
      {/*
      <p>Weather Severity: {flightData.weatherSeverity}</p>
      <p>Historical Delay Rate: {flightData.historicalDelayRate}</p>
      <p>Airport Congestion: {flightData.airportCongestion}</p>
      */}
    </div>
  );
}

export default FlightDisplayCard;
