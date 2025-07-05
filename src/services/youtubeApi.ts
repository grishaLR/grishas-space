// YouTube Data API Integration
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Search for music videos
export const searchYouTubeMusic = async (
  query: string,
  apiKey: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> => {
  try {
    const url = new URL(`${YOUTUBE_API_BASE}/search`);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'video');
    url.searchParams.append('videoCategoryId', '10'); // Music category
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('key', apiKey);


    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 403) {
        throw new Error(`YouTube API 403 Forbidden - Check API key quota and restrictions`);
      } else if (response.status === 400) {
        throw new Error(`YouTube API 400 Bad Request - Invalid parameters`);
      } else {
        throw new Error(`YouTube API error: ${response.status} - ${response.statusText}`);
      }
    }

    const data: YouTubeSearchResponse = await response.json();
    
    return data.items || [];
  } catch (error) {
    return [];
  }
};

// Find YouTube video for Last.fm track
export const findYouTubeVideoFromLastFm = async (
  trackName: string,
  artistName: string,
  apiKey: string
): Promise<YouTubeVideo | null> => {
  try {
    
    // Try exact search first
    const exactQuery = `${artistName} ${trackName} official`;
    let results = await searchYouTubeMusic(exactQuery, apiKey, 5);
    
    if (results.length > 0) {
      // Prefer official videos, music videos, or audio uploads
      const preferred = results.find(video => 
        video.snippet.title.toLowerCase().includes('official') ||
        video.snippet.title.toLowerCase().includes('music video') ||
        video.snippet.channelTitle.toLowerCase().includes(artistName.toLowerCase())
      );
      
      if (preferred) {
        return preferred;
      }
      
      return results[0];
    }

    // Try broader search
    const broadQuery = `${artistName} ${trackName}`;
    results = await searchYouTubeMusic(broadQuery, apiKey, 10);
    
    if (results.length > 0) {
      return results[0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Transform YouTube video to our format
export const transformYouTubeVideo = (video: YouTubeVideo) => {
  return {
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
    channel: video.snippet.channelTitle,
    youtubeUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
    publishedAt: video.snippet.publishedAt
  };
};