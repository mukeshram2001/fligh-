import React, { useState, useEffect } from 'react';
import './App.css';

import FlightSearchForm from './components/FlightSearchForm';
import FlightDisplayCard from './components/FlightDisplayCard';
import GeminiExplain from './components/GeminiExplain';
import LoadingSpinner from './components/LoadingSpinner';
// Placeholder for future components
// import MapComponent from './components/MapComponent';
// import ChartComponent from './components/ChartComponent';

import { fetchFlightPrediction } from './services/apiService';
import { fetchGeminiExplanation } from './services/geminiService';
import { predictDelay } from './services/predictionService';
import { getApiKey } from './utils/localStorage';

function App() {
  const [flightNumberInput, setFlightNumberInput] = useState(''); // To keep track of the input for re-triggering Gemini
  const [flightData, setFlightData] = useState(null);
  const [delayPrediction, setDelayPrediction] = useState(null);
  const [geminiExplanation, setGeminiExplanation] = useState('');

  const [isLoadingFlight, setIsLoadingFlight] = useState(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [error, setError] = useState('');

  const [userGeminiApiKey, setUserGeminiApiKey] = useState('');

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setUserGeminiApiKey(storedKey);
    }
  }, []);

  const handleFlightSearch = async (flightNum) => {
    setIsLoadingFlight(true);
    setError('');
    setFlightData(null);
    setDelayPrediction(null);
    setGeminiExplanation(''); // Clear previous explanation
    setFlightNumberInput(flightNum); // Store for potential Gemini use

    try {
      const data = await fetchFlightPrediction(flightNum);
      setFlightData(data);
      const prediction = predictDelay(data);
      setDelayPrediction(prediction);
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err.message || 'Failed to fetch flight data. Please check the flight number or try again later.');
      setFlightData(null); // Ensure no stale data is shown
      setDelayPrediction(null);
    } finally {
      setIsLoadingFlight(false);
    }
  };

  const handleGeminiExplain = async (apiKeyFromComponent) => {
    if (!flightData || delayPrediction === null) {
      setError("Cannot get AI explanation without flight data and prediction.");
      return;
    }

    // Ensure we use the latest API key, either from component state or initial load
    const currentApiKey = apiKeyFromComponent || userGeminiApiKey;
    if (!currentApiKey) {
        setError("Gemini API Key is not set. Please set it to get AI insights.");
        // Optionally, trigger the GeminiExplain component to show key input
        // This might require a ref or a callback prop to GeminiExplain component
        return;
    }
    setUserGeminiApiKey(currentApiKey); // Update app state if component changed it

    setIsLoadingGemini(true);
    setError('');
    setGeminiExplanation('');

    try {
      const result = await fetchGeminiExplanation(flightData, delayPrediction, currentApiKey);
      setGeminiExplanation(result.explanation);
    } catch (err) {
      console.error("Gemini explanation error:", err);
      setError(err.message || 'Failed to get AI explanation. The API key might be invalid or there could be a network issue.');
      setGeminiExplanation(''); // Clear any partial or error message that might have been set
    } finally {
      setIsLoadingGemini(false);
    }
  };

  return (
    <div className="App">
      {(isLoadingFlight || isLoadingGemini) && <LoadingSpinner />}

      <header className="App-header">
        <h1>Live Flight Delay Predictor</h1>
      </header>

      <main>
        <FlightSearchForm onSearch={handleFlightSearch} loading={isLoadingFlight} />

        {error && <p className="error-message">{error}</p>}

        {flightData && !isLoadingFlight && (
          <FlightDisplayCard
            flightData={flightData}
            delayPrediction={delayPrediction}
          />
        )}

        {flightData && delayPrediction !== null && !isLoadingFlight && (
          <GeminiExplain
            flightData={flightData}
            predictedDelay={delayPrediction}
            onExplain={handleGeminiExplain}
            loading={isLoadingGemini}
            explanation={geminiExplanation}
          />
        )}

        {/* Placeholders for future Map and Chart components */}
        {/* <div className="placeholders-container">
          <MapComponent flightData={flightData} />
          <ChartComponent flightData={flightData} />
        </div> */}
      </main>

      <footer>
        <p>Flight Delay Predictor MVP | Powered by AI</p>
        <p><small>Note: Flight data and predictions are based on simulated data for this MVP.</small></p>
      </footer>
    </div>
  );
}

export default App;
