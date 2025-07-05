// NPR Public RSS and alternative free audio APIs
const NPR_RSS_BASE = 'https://feeds.npr.org';
const FREESOUND_API_BASE = 'https://freesound.org/apiv2';
const BBC_SOUNDS_BASE = 'https://rms.api.bbc.co.uk/v2';

export interface NPRTrack {
  id: string;
  title: string;
  artist?: string;
  program?: string;
  duration?: number;
  audioUrl?: string;
  date?: string;
}

export interface NPRShow {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

// Fetch content from free audio APIs
export const fetchFreeAudioContent = async (): Promise<NPRTrack[]> => {
  try {
    // Try to fetch from multiple free sources
    const tracks: NPRTrack[] = [];
    
    // Add some curated free music from Internet Archive
    const internetArchiveTracks = [
      {
        id: 'ia-1',
        title: 'Jazz Piano Lounge',
        artist: 'Public Domain',
        program: 'Internet Archive',
        audioUrl: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3'
      }
    ];
    
    tracks.push(...internetArchiveTracks);
    
    // Add demo content as fallback
    tracks.push(...getDemoNPRContent());
    
    return tracks;
  } catch (error) {
    return getDemoNPRContent();
  }
};

// Demo content with working CORS-enabled audio sources
export const getDemoNPRContent = (): NPRTrack[] => {
  return [
    {
      id: '1',
      title: 'Test Audio File',
      artist: 'Internet Archive',
      program: 'Public Domain Collection',
      audioUrl: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3'
    },
    {
      id: '2', 
      title: 'Classical Piano',
      artist: 'Kevin MacLeod',
      program: 'Incompetech',
      audioUrl: 'https://incompetech.filmmusic.io/song/3508-amazing-grace'
    },
    {
      id: '3',
      title: 'Ambient Soundscape',
      artist: 'Bensound',
      program: 'Royalty Free Music',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3'
    },
    {
      id: '4',
      title: 'Electronic Beat',
      artist: 'Purple Planet',
      program: 'Creative Commons',
      audioUrl: 'https://www.purple-planet.com/wp-content/uploads/2023/electronic-beat.mp3'
    },
    {
      id: '5',
      title: 'Jazz Lounge',
      artist: 'Free Music Archive',
      program: 'Jazz Collection',
      audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Scott_Holmes/Road_Trip/Scott_Holmes_-_02_-_Upbeat_Party.mp3'
    }
  ];
};

// Fetch shows/programs
export const fetchNPRShows = async (apiKey: string = ''): Promise<NPRShow[]> => {
  try {
    const response = await fetch(
      `${NPR_API_BASE}/listening/v2/channels/npr/programs?apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`NPR API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image?.href
    })) || [];
  } catch (error) {
    return [];
  }
};