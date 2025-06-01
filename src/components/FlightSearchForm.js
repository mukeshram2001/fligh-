import React, { useState } from 'react';
import './FlightSearchForm.css';

function FlightSearchForm({ onSearch, loading }) {
  const [flightNumber, setFlightNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flightNumber.trim()) {
      onSearch(flightNumber.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flight-search-form">
      <input
        type="text"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
        placeholder="Enter Flight Number (e.g., UA245)"
        className="flight-input"
        disabled={loading}
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Searching...' : 'Predict Delay'}
      </button>
    </form>
  );
}

export default FlightSearchForm;
