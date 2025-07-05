// Apple Music / MusicKit Integration
// This file handles MusicKit initialization and playback control

import { fetchMusicKitToken } from './tokenService';

interface MusicKitConfig {
  developerToken: string;
  app: {
    name: string;
    build: string;
  };
}

declare global {
  interface Window {
    MusicKit: any;
  }
}

// Initialize MusicKit instance
let musicKitInstance: any = null;

// Initialize MusicKit with automatic token fetching
export const initializeMusicKit = async () => {
  if (!window.MusicKit) {
    throw new Error('MusicKit JS not loaded. Make sure the script is included in your HTML.');
  }

  try {
    // Fetch token from server
    const developerToken = await fetchMusicKitToken();
    
    musicKitInstance = await window.MusicKit.configure({
      developerToken,
      app: {
        name: 'Grisha\'s Space',
        build: '1.0.0',
      },
      // Optional: Add custom storage key for auth persistence
      storefrontId: 'us', // Change based on user region
    });

    return musicKitInstance;
  } catch (error) {
    throw error;
  }
};

// Authorize user with Apple Music
export const authorizeAppleMusic = async () => {
  if (!musicKitInstance) {
    throw new Error('MusicKit not initialized. Call initializeMusicKit first.');
  }

  try {
    
    // Try the correct method based on MusicKit JS docs
    const musicUserToken = await musicKitInstance.authorize();
    return musicUserToken;
  } catch (error) {
    throw error;
  }
};

// Check if user is authorized
export const isAuthorized = () => {
  return musicKitInstance?.isAuthorized || false;
};

// Search for songs
export const searchAppleMusic = async (query: string, types = ['songs']) => {
  if (!musicKitInstance) {
    throw new Error('MusicKit not initialized');
  }

  try {
    // Use the music API function to make a search request
    const instance = window.MusicKit.getInstance();
    const api = instance.api;
    
    // The correct path for search in Apple Music API
    const searchPath = `/v1/catalog/${api.storefrontId}/search`;
    const params = {
      term: query,
      types: types.join(','),
      limit: 25
    };
    
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const fullPath = `${searchPath}?${queryString}`;
    
    
    // Use the music API function
    const results = await api.music(fullPath);
    return results;
  } catch (error) {
    throw error;
  }
};

// Play a song by ID
export const playSong = async (songId: string) => {
  if (!musicKitInstance) {
    throw new Error('MusicKit not initialized');
  }

  try {
    // Use the global MusicKit player methods
    const player = window.MusicKit.getInstance().player;
    
    // Set the queue and play
    await player.setQueue({
      song: songId
    });
    
    await player.play();
  } catch (error) {
    throw error;
  }
};

// Get current playback state
export const getPlaybackState = () => {
  if (!musicKitInstance) {
    return null;
  }

  try {
    const instance = window.MusicKit.getInstance();
    const player = instance?.player;
    
    if (!player) {
      return {
        isPlaying: false,
        nowPlaying: null,
        currentTime: 0,
        duration: 0,
      };
    }

    return {
      isPlaying: player.isPlaying || false,
      nowPlaying: player.nowPlayingItem || null,
      currentTime: player.currentPlaybackTime || 0,
      duration: player.currentPlaybackDuration || 0,
    };
  } catch (error) {
    return {
      isPlaying: false,
      nowPlaying: null,
      currentTime: 0,
      duration: 0,
    };
  }
};

// Control playback
export const playPause = async () => {
  if (!musicKitInstance) return;
  
  const player = window.MusicKit.getInstance().player;
  if (player.isPlaying) {
    await player.pause();
  } else {
    await player.play();
  }
};

export const skipToNext = async () => {
  if (!musicKitInstance) return;
  await musicKitInstance.skipToNextItem();
};

export const skipToPrevious = async () => {
  if (!musicKitInstance) return;
  await musicKitInstance.skipToPreviousItem();
};

// Get the music player instance for Web Audio API integration
export const getMusicPlayer = () => {
  return musicKitInstance?.player;
};

// Get recently played
export const getRecentlyPlayed = async () => {
  if (!musicKitInstance) {
    throw new Error('MusicKit not initialized');
  }

  try {
    const response = await musicKitInstance.api.library.recentlyPlayed();
    return response;
  } catch (error) {
    throw error;
  }
};