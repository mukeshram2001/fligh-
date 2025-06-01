// src/utils/localStorage.js

const GEMINI_API_KEY_NAME = 'geminiApiKey';

/**
 * Retrieves the Gemini API key from localStorage.
 * @returns {string|null} The API key, or null if not found.
 */
export const getApiKey = () => {
  try {
    return localStorage.getItem(GEMINI_API_KEY_NAME);
  } catch (error) {
    console.error("Error retrieving API key from localStorage:", error);
    return null;
  }
};

/**
 * Saves the Gemini API key to localStorage.
 * @param {string} apiKey - The API key to save.
 */
export const setApiKey = (apiKey) => {
  try {
    localStorage.setItem(GEMINI_API_KEY_NAME, apiKey);
  } catch (error) {
    console.error("Error saving API key to localStorage:", error);
  }
};

/**
 * Removes the Gemini API key from localStorage.
 */
export const removeApiKey = () => {
  try {
    localStorage.removeItem(GEMINI_API_KEY_NAME);
  } catch (error) {
    console.error("Error removing API key from localStorage:", error);
  }
};
