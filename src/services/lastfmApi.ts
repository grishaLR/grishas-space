// Last.fm API Integration
const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_API_KEY = 'YOUR_LASTFM_API_KEY'; // Replace with your actual API key

export interface LastFmTrack {
  name: string;
  artist: {
    '#text': string;
    mbid?: string;
  };
  album?: {
    '#text': string;
    mbid?: string;
  };
  url?: string;
  image?: Array<{
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge';
  }>;
  date?: {
    uts: string;
    '#text': string;
  };
  '@attr'?: {
    nowplaying?: string;
  };
  mbid?: string;
  playcount?: string;
}

export interface LastFmUser {
  name: string;
  realname?: string;
  image?: Array<{
    '#text': string;
    size: string;
  }>;
  playcount?: string;
  country?: string;
  registered?: {
    unixtime: string;
    '#text': string;
  };
}

export interface LastFmResponse {
  recenttracks?: {
    track: LastFmTrack[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      total: string;
      perPage: string;
    };
  };
  user?: LastFmUser;
  error?: number;
  message?: string;
}

// Get user's recent tracks (including currently playing)
export const getRecentTracks = async (
  username: string,
  apiKey: string = LASTFM_API_KEY,
  limit: number = 10
): Promise<LastFmTrack[]> => {
  try {
    const url = new URL(LASTFM_API_BASE);
    url.searchParams.append('method', 'user.getrecenttracks');
    url.searchParams.append('user', username);
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', limit.toString());

    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data: LastFmResponse = await response.json();
    
    if (data.error) {
      throw new Error(`Last.fm error ${data.error}: ${data.message}`);
    }

    const tracks = data.recenttracks?.track || [];
    return tracks;
  } catch (error) {
    return [];
  }
};

// Get currently playing track
export const getCurrentTrack = async (
  username: string,
  apiKey: string = LASTFM_API_KEY
): Promise<LastFmTrack | null> => {
  const tracks = await getRecentTracks(username, apiKey, 1);
  
  // Check if the first track has the "nowplaying" attribute
  const currentTrack = tracks[0];
  if (currentTrack?.['@attr']?.nowplaying === 'true') {
    return currentTrack;
  }
  
  return null;
};

// Get user info
export const getUserInfo = async (
  username: string,
  apiKey: string = LASTFM_API_KEY
): Promise<LastFmUser | null> => {
  try {
    const url = new URL(LASTFM_API_BASE);
    url.searchParams.append('method', 'user.getinfo');
    url.searchParams.append('user', username);
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data: LastFmResponse = await response.json();
    
    if (data.error) {
      throw new Error(`Last.fm error ${data.error}: ${data.message}`);
    }

    return data.user || null;
  } catch (error) {
    return null;
  }
};

// Transform Last.fm track to our format
export const transformLastFmTrack = (track: LastFmTrack) => {
  const albumArt = track.image?.find(img => img.size === 'large' || img.size === 'extralarge')?.[`#text`];
  
  return {
    id: track.mbid || `${track.artist['#text']}-${track.name}`,
    name: track.name,
    artist: track.artist['#text'],
    album: track.album?.['#text'] || 'Unknown Album',
    albumArt,
    url: track.url,
    isPlaying: track['@attr']?.nowplaying === 'true',
    playedAt: track.date ? new Date(parseInt(track.date.uts) * 1000) : undefined
  };
};

// Demo function for testing without API key
export const getDemoLastFmData = () => {
  return [
    {
      id: 'demo-1',
      name: 'Is This It',
      artist: 'The Strokes',
      album: 'Is This It',
      isPlaying: true
    },
    {
      id: 'demo-2',
      name: 'Last Nite',
      artist: 'The Strokes',
      album: 'Is This It',
      isPlaying: false
    },
    {
      id: 'demo-3',
      name: 'Someday',
      artist: 'The Strokes',
      album: 'Is This It',
      isPlaying: false
    }
  ];
};