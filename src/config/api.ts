/**
 * Central API configuration.
 *
 * - In development: falls back to http://localhost:5000
 * - In production (Render/Vercel/Railway): set VITE_API_URL env var to the
 *   deployed backend URL (e.g. https://digital-asset-protection-backend.onrender.com)
 */
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

export default API_BASE_URL;
