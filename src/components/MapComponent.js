// src/components/MapComponent.js
import React from 'react';

function MapComponent({ flightData }) {
  // In a real implementation, you would use flightData (e.g., origin/destination coordinates)
  // to initialize and display a map (e.g., using Mapbox GL JS).

  if (!flightData) {
    // Optionally, don't render or show a generic placeholder if no flight data
    // return <p>Map will be displayed here once flight data is available.</p>;
    return null;
  }

  return (
    <div className="map-placeholder">
      <h4>Flight Route Map</h4>
      <p>
        Origin: {flightData.flightDetails?.origin || 'N/A'} <br />
        Destination: {flightData.flightDetails?.destination || 'N/A'}
      </p>
      <div style={{ height: '150px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
        [Map Placeholder - e.g., Mapbox GL JS integration]
      </div>
      <p><small>A map showing flight origin and destination could be displayed here.</small></p>
    </div>
  );
}

export default MapComponent;
