// src/services/predictionService.js

/**
 * Calculates the delay probability based on various factors.
 *
 * @param {object} flightData - The aggregated data from the Cloudflare Worker.
 * @param {number} flightData.weatherSeverity - Numerical value (0-1) for weather severity.
 * @param {number} flightData.historicalDelayRate - Numerical value (0-1) for historical delay.
 * @param {number} flightData.airportCongestion - Numerical value (0-1) for airport congestion.
 * @returns {number} The predicted delay probability, clamped between 0 and 1.
 */
export function predictDelay(flightData) {
  const WEATHER_IMPACT = 0.4;
  const HISTORICAL_DELAY_IMPACT = 0.3; // Renamed for clarity
  const AIRPORT_CONGESTION_IMPACT = 0.3; // Renamed for clarity

  // Ensure inputs are numbers and default to 0 if not, or if flightData itself is null/undefined
  const weatherSeverity = Number(flightData?.weatherSeverity) || 0;
  const historicalDelayRate = Number(flightData?.historicalDelayRate) || 0;
  const airportCongestion = Number(flightData?.airportCongestion) || 0;

  let delayProbability = (
    (weatherSeverity * WEATHER_IMPACT) +
    (historicalDelayRate * HISTORICAL_DELAY_IMPACT) +
    (airportCongestion * AIRPORT_CONGESTION_IMPACT)
  );

  // Clamp probability between 0 and 1
  delayProbability = Math.max(0, Math.min(1, delayProbability));

  return delayProbability;
}
