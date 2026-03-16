// todo: use Expo's env vars for this in production; smth like process.env.EXPO_PUBLIC_API_URL
const BASE_URL = 'http://localhost:5000';

export const fetchSearchResults = async (query: string, type: string = 'all') => {
  try {
    const response = await fetch(`${BASE_URL}/api/music/search?query=${encodeURIComponent(query)}&type=${type}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (fetchSearchResults):', error);
    throw error;
  }
};