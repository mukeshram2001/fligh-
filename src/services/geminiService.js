// src/services/geminiService.js

const WORKER_BASE_URL = process.env.REACT_APP_WORKER_URL || '';

/**
 * Fetches AI-powered explanation from the Cloudflare Worker using Gemini.
 *
 * @param {object} flightData - The flight data object.
 * @param {number} predictedDelay - The predicted delay probability.
 * @param {string} userGeminiApiKey - The user's Gemini API key.
 * @returns {Promise<object>} A promise that resolves to the AI explanation.
 * @throws {Error} If the API request fails.
 */
export const fetchGeminiExplanation = async (flightData, predictedDelay, userGeminiApiKey) => {
  const endpoint = `${WORKER_BASE_URL}/api/gemini-explain`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the Gemini API key in a custom header if needed, or include in body
        // For this implementation, the worker expects it in the body.
      },
      body: JSON.stringify({ flightData, predictedDelay, userGeminiApiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      throw new Error(errorData.error || `Gemini API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Gemini explanation:', error);
    throw error; // Re-throw to be caught by the calling component
  }
};
