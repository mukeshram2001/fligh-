// src/services/apiService.js

// Base URL for the Cloudflare Worker.
// In development, this might be http://localhost:8787 (if using `wrangler dev`)
// In production, this will be your deployed worker URL.
// For this MVP, we'll assume it's either configured via an env variable
// or defaults to a relative path if the frontend and worker are on the same domain.
const WORKER_BASE_URL = process.env.REACT_APP_WORKER_URL || '';

/**
 * Fetches flight prediction data from the Cloudflare Worker.
 *
 * @param {string} flightNumber - The flight number to search for.
 * @returns {Promise<object>} A promise that resolves to the aggregated flight data.
 * @throws {Error} If the API request fails.
 */
export const fetchFlightPrediction = async (flightNumber) => {
  const endpoint = `${WORKER_BASE_URL}/api/flight-predict`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching flight prediction:', error);
    throw error; // Re-throw to be caught by the calling component
  }
};
