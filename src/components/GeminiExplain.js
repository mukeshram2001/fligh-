import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../utils/localStorage';
import './GeminiExplain.css';

function GeminiExplain({ flightData, predictedDelay, onExplain, loading, explanation }) {
  const [apiKey, setUserApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setUserApiKey(storedKey);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true); // Prompt for key if not found
    }
  }, []);

  const handleKeySave = () => {
    setApiKey(apiKey);
    setShowKeyInput(false);
    // Optionally, trigger explanation if conditions are met
    // if (flightData && predictedDelay !== null && apiKey) {
    //   onExplain(apiKey);
    // }
  };

  const handleExplainClick = () => {
    if (!apiKey) {
      setShowKeyInput(true);
      alert("Please enter your Gemini API Key first.");
      return;
    }
    if (flightData && predictedDelay !== null) {
      onExplain(apiKey);
    }
  };

  if (!flightData) { // Don't show if no flight data yet
      return null;
  }

  return (
    <div className="gemini-explain-container">
      {showKeyInput && (
        <div className="api-key-input-section">
          <h4>Set Your Google Gemini API Key</h4>
          <p>To use the AI explanation feature, please enter your Gemini API key. This will be stored locally in your browser.</p>
          <input
            type="password" // Use password type for sensitive keys
            value={apiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            placeholder="Enter your Gemini API Key"
            className="api-key-input"
          />
          <button onClick={handleKeySave} className="api-key-save-button">
            Save Key
          </button>
        </div>
      )}

      {!showKeyInput && apiKey && (
        <button
          onClick={handleExplainClick}
          disabled={loading || !flightData || predictedDelay === null}
          className="explain-ai-button"
        >
          {loading ? 'Getting AI Insights...' : 'Explain with AI'}
        </button>
      )}
       {!apiKey && !showKeyInput && (
         <button onClick={() => setShowKeyInput(true)} className="explain-ai-button">
            Configure Gemini API Key for AI Insights
         </button>
       )}


      {explanation && (
        <div className="ai-explanation-result">
          <h4>AI Generated Insights:</h4>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default GeminiExplain;
