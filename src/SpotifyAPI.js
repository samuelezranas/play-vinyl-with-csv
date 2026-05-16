/**
 * Spotify API Service
 * Handles authentication and API calls to Spotify Web API
 */

let accessToken = null;
let tokenExpiry = null;

/**
 * Get valid access token using Client Credentials flow
 */
export const getSpotifyAccessToken = async () => {
  // Check if cached token is still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = `Spotify credentials not configured. 
    CLIENT_ID: ${clientId ? '✓ Loaded' : '✗ Missing'}
    CLIENT_SECRET: ${clientSecret ? '✓ Loaded' : '✗ Missing'}
    Make sure .env.local has VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET`;
    console.error(error);
    throw new Error(error);
  }

  try {
    console.log('🔑 Authenticating with Spotify API...');
    const auth = btoa(`${clientId}:${clientSecret}`);
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Spotify auth error response:', errorData);
      throw new Error(`Spotify auth failed (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Token expires in ~1 hour, refresh after 55 minutes
    tokenExpiry = Date.now() + (data.expires_in * 1000) - (5 * 60 * 1000);

    console.log('✓ Spotify access token obtained successfully');
    return accessToken;
  } catch (error) {
    console.error('❌ Failed to get Spotify access token:', error.message);
    throw error;
  }
};

/**
 * Fetch track details from Spotify API
 */
export const getSpotifyTrack = async (trackId) => {
  if (!trackId) return null;

  try {
    const token = await getSpotifyAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Track not found: ${trackId}`);
      return null;
    }

    const track = await response.json();
    return track;
  } catch (error) {
    console.error(`Error fetching track ${trackId}:`, error);
    return null;
  }
};

/**
 * Search for tracks on Spotify
 */
export const searchSpotifyTracks = async (query, limit = 10) => {
  try {
    const token = await getSpotifyAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

/**
 * Get multiple tracks info at once
 */
export const getSpotifyTracks = async (trackIds) => {
  if (!trackIds || trackIds.length === 0) return [];

  try {
    const token = await getSpotifyAccessToken();
    
    // Spotify API allows max 50 tracks per request
    const results = [];
    for (let i = 0; i < trackIds.length; i += 50) {
      const batch = trackIds.slice(i, i + 50);
      const response = await fetch(
        `https://api.spotify.com/v1/tracks?ids=${batch.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`Batch request failed: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      results.push(...data.tracks);
    }

    return results;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
};
