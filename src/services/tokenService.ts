// Token service for fetching MusicKit tokens from the server
// This handles caching and renewal of tokens

interface TokenResponse {
  token: string;
  expiresIn: number;
  issuedAt: number;
}

interface CachedToken extends TokenResponse {
  cachedAt: number;
}

const TOKEN_CACHE_KEY = 'musickit_token_cache';
const TOKEN_BUFFER_TIME = 24 * 60 * 60; // Renew 1 day before expiry

// Get API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use your actual API URL
    return import.meta.env.VITE_API_URL || '/api';
  }
  // In development, use local server
  return 'http://localhost:3333/api';
};

// Check if cached token is still valid
const isTokenValid = (cachedToken: CachedToken): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = cachedToken.issuedAt + cachedToken.expiresIn;
  return now < (expiresAt - TOKEN_BUFFER_TIME);
};

// Get token from cache
const getCachedToken = (): string | null => {
  try {
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    if (!cached) return null;

    const cachedToken: CachedToken = JSON.parse(cached);
    
    if (isTokenValid(cachedToken)) {
      return cachedToken.token;
    }
    
    localStorage.removeItem(TOKEN_CACHE_KEY);
    return null;
  } catch (error) {
    return null;
  }
};

// Fetch new token from server
export const fetchMusicKitToken = async (): Promise<string> => {
  // Check cache first
  const cachedToken = getCachedToken();
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const response = await fetch(`${getApiUrl()}/musickit-token`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch token');
    }

    const tokenData: TokenResponse = await response.json();
    
    // Cache the token
    const cacheData: CachedToken = {
      ...tokenData,
      cachedAt: Math.floor(Date.now() / 1000),
    };
    
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cacheData));
    
    return tokenData.token;
  } catch (error) {
    throw error;
  }
};

// Clear cached token (useful for debugging or on logout)
export const clearCachedToken = () => {
  localStorage.removeItem(TOKEN_CACHE_KEY);
};