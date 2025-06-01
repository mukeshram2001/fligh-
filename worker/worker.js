// worker/worker.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Placeholder for API keys and endpoints - User should configure these as environment variables in Cloudflare
// const FLIGHT_API_URL_TEMPLATE = "https://api.flightradar24.com/common/v1/flight/list.json?query={FLIGHT_NUMBER}&fetchGeneric=true&fetchALInfo=true"; // Example
// const WEATHER_API_URL_TEMPLATE = "https://api.openweathermap.org/data/2.5/weather?q={AIRPORT_ICAO}&appid={WEATHER_API_KEY}&units=metric"; // Example

// Default Gemini API Key (can be overridden by user's key from frontend)
// It's better to set this as an environment variable in Cloudflare for production (e.g., `GEMINI_API_KEY_WORKER`)
const DEFAULT_GEMINI_API_KEY = 'AIzaSyBcVLbGVVhEbRbn1k0krUD9U3ymAOT57TI';


export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Simple CORS handling for preflight and actual requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Gemini-API-Key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/flight-predict') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const { flightNumber } = await request.json();

        if (!flightNumber) {
          return new Response(JSON.stringify({ error: 'Flight number is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // --- Simulate External API Calls ---
        // In a real scenario, you'd use fetch() here to call actual APIs
        // For MVP, we use placeholder data.

        // Simulate Flight Data API
        const simulatedFlightDetails = {
          airline: flightNumber.substring(0, 2), // e.g., UA
          flightNumber: flightNumber,
          origin: 'SFO', // Placeholder
          destination: 'JFK', // Placeholder
          scheduledDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          scheduledArrival: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(), // 7 hours from now
        };

        // Simulate Live Status
        const simulatedLiveStatus = {
          currentStatus: 'Scheduled', // Could be 'Delayed', 'On Time', 'Departed'
          estimatedTime: simulatedFlightDetails.scheduledDeparture,
        };

        // Simulate Weather API (deriving severity)
        // For simplicity, let's assume a random weather severity.
        // In reality, this would parse weather API response (temp, visibility, conditions like rain, snow, thunderstorm)
        const simulatedWeatherSeverity = Math.random() * 0.6; // 0 to 0.6 to keep it somewhat reasonable

        // Placeholder data for other factors
        const historicalDelayRate = Math.random() * 0.4; // 0 to 0.4
        const airportCongestion = Math.random() * 0.5; // 0 to 0.5

        const responseData = {
          flightDetails: simulatedFlightDetails,
          liveStatus: simulatedLiveStatus,
          weatherSeverity: parseFloat(simulatedWeatherSeverity.toFixed(2)),
          historicalDelayRate: parseFloat(historicalDelayRate.toFixed(2)),
          airportCongestion: parseFloat(airportCongestion.toFixed(2)),
          // You would include actual API URLs/keys used or notes for the user here if needed
          // apiPlaceholders: {
          //   flightApiUsed: `Simulated for ${flightNumber}`,
          //   weatherApiUsed: "Simulated for departure/arrival airports",
          //   FLIGHT_API_URL_NOTE: "Configure FLIGHT_API_URL_TEMPLATE in worker environment for live data.",
          //   WEATHER_API_KEY_NOTE: "Configure WEATHER_API_KEY and WEATHER_API_URL_TEMPLATE for live data."
          // }
        };

        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (url.pathname === '/api/gemini-explain') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { flightData, predictedDelay, userGeminiApiKey } = await request.json();

        const apiKey = userGeminiApiKey || env.GEMINI_API_KEY_WORKER || DEFAULT_GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Gemini API Key is missing.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
        }
        if (!flightData || predictedDelay === undefined) {
            return new Response(JSON.stringify({ error: 'Flight data and predicted delay are required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const delayPercentage = (predictedDelay * 100).toFixed(0);
        const weatherSummary = `Weather severity score: ${flightData.weatherSeverity} (0-1 scale). Consider this implies conditions that might affect operations.`; // Basic summary

        const prompt = `You are a helpful travel assistant. Given the following flight information and predicted delay, provide a brief, user-friendly explanation of potential reasons for the delay (based on the provided factors like weather) and one or two general travel tips if a delay is likely.
        Flight: ${flightData.flightDetails?.airline} ${flightData.flightDetails?.flightNumber} from ${flightData.flightDetails?.origin} to ${flightData.flightDetails?.destination}.
        Predicted Delay Risk: ${delayPercentage}%.
        Factors considered: Weather Severity (${flightData.weatherSeverity}), Historical Delay Rate (${flightData.historicalDelayRate}), Airport Congestion (${flightData.airportCongestion}).
        Current Status: ${flightData.liveStatus?.currentStatus}.

        Focus on the provided factors when explaining potential reasons. Keep the explanation concise (2-4 sentences) and tips practical.`;

        try {
          const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 250,
          };
          const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          ];

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{text: prompt}]}],
            generationConfig,
            safetySettings
          });

          if (result.response) {
            const explanation = result.response.candidates[0]?.content?.parts[0]?.text || "AI explanation could not be generated at this time.";
            return new Response(JSON.stringify({ explanation }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            console.error("Gemini API Error: No response object or candidates.", result);
            return new Response(JSON.stringify({ error: 'Failed to get explanation from AI. No valid response.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
          }
        } catch (e) {
          console.error("Error calling Gemini API:", e.message);
          let errorMessage = 'Error calling Gemini API.';
          if (e.message && e.message.includes("API key not valid")) {
            errorMessage = "The provided Gemini API Key is not valid. Please check the key and try again.";
          } else if (e.message && e.message.includes("quota")) {
            errorMessage = "Gemini API quota exceeded. Please check your quota or try again later.";
          }
          return new Response(JSON.stringify({ error: errorMessage, details: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
        }
      } else {
        return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }
  },
};
