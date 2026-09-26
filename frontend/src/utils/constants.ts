const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '');
export const API_BASE_URL =
  rawBaseUrl === '/api' || rawBaseUrl.endsWith('/api')
    ? rawBaseUrl
    : `${rawBaseUrl}/api`;

export const SAMPLE_TOPICS = [
  'Photosynthesis and Plant Cellular Respiration',
  'JavaScript Promises and Async/Await Mechanics',
  'The French Revolution: Key Causes and Timeline',
];
