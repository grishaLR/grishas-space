// Last.fm Configuration
//
// To set up Last.fm integration:
// 1. Go to https://www.last.fm/api/account/create
// 2. Create a new API application
// 3. Get your API key and add it below
// 4. Add your Last.fm username below
// 5. Install Last.fm scrobbler on your devices to track your listening


export const LASTFM_CONFIG = {
  // Replace with your Last.fm username
  USERNAME: import.meta.env.VITE_LAST_FM_USERNAME,

  // Replace with your Last.fm API key (from https://www.last.fm/api/account/create)
  API_KEY: import.meta.env.VITE_LAST_FM_API_KEY,

  // How often to check for new tracks (in milliseconds)
  UPDATE_INTERVAL: 30000, // 30 seconds

  // Set to false once you have real credentials
  USE_DEMO: false,
};

// Spotify integration removed - no longer provides preview URLs as of Nov 27, 2024

export const YOUTUBE_CONFIG = {
  // YouTube API credentials
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
  
  // Enable YouTube integration
  ENABLED: !!import.meta.env.VITE_YOUTUBE_API_KEY,
};

// Quick setup guide:
// 1. Sign up at https://www.last.fm if you don't have an account
// 2. Install Last.fm scrobbler:
//    - iOS: Last.fm app from App Store (enable scrobbling in settings)
//    - Mac: Last.fm Desktop Scrobbler or Scrobbles for Last.fm
//    - Other: Check https://www.last.fm/about/trackmymusic
// 3. Make sure scrobbling is working by playing music and checking your Last.fm profile
// 4. Get API credentials from https://www.last.fm/api/account/create
// 5. Update the config above with your username and API key
// 6. Set USE_DEMO to false
