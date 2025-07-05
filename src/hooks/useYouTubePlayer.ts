import { useState, useCallback } from 'react';
import { 
  findYouTubeVideoFromLastFm, 
  transformYouTubeVideo,
  YouTubeVideo 
} from '@/services/youtubeApi';

interface UseYouTubePlayerOptions {
  apiKey?: string;
  enabled?: boolean;
}

interface EnhancedTrackWithYouTube {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt?: string;
  previewUrl?: string; // From Spotify
  youtubeUrl?: string; // YouTube video URL
  youtubeEmbedUrl?: string; // YouTube embed URL
  youtubeVideoId?: string; // For iframe embedding
  spotifyUrl?: string;
  isPlaying?: boolean;
  playedAt?: Date;
  lastFmData?: any;
  spotifyData?: any;
  youtubeData?: any;
}

export const useYouTubePlayer = ({
  apiKey,
  enabled = true
}: UseYouTubePlayerOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for YouTube searches to prevent duplicate API calls
  const getCacheKey = (trackName: string, artistName: string) => 
    `youtube_${artistName}_${trackName}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const getCachedResult = (trackName: string, artistName: string) => {
    try {
      const cached = localStorage.getItem(getCacheKey(trackName, artistName));
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCachedResult = (trackName: string, artistName: string, result: any) => {
    try {
      localStorage.setItem(getCacheKey(trackName, artistName), JSON.stringify(result));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Enhance track with YouTube data
  const enhanceTrackWithYouTube = useCallback(async (
    track: any
  ): Promise<EnhancedTrackWithYouTube> => {
    if (!apiKey || !enabled) {
      // Return track without YouTube enhancement
      return {
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        albumArt: track.albumArt,
        previewUrl: track.previewUrl,
        spotifyUrl: track.spotifyUrl,
        isPlaying: track.isPlaying,
        playedAt: track.playedAt,
        lastFmData: track.lastFmData,
        spotifyData: track.spotifyData
      };
    }

    try {
      const youtubeVideo = await findYouTubeVideoFromLastFm(
        track.name,
        track.artist,
        apiKey
      );

      if (youtubeVideo) {
        const transformedYouTube = transformYouTubeVideo(youtubeVideo);
        
        return {
          id: track.id,
          name: track.name,
          artist: track.artist,
          album: track.album,
          albumArt: track.albumArt,
          previewUrl: track.previewUrl,
          youtubeUrl: transformedYouTube.youtubeUrl,
          youtubeEmbedUrl: transformedYouTube.embedUrl,
          youtubeVideoId: transformedYouTube.id,
          spotifyUrl: track.spotifyUrl,
          isPlaying: track.isPlaying,
          playedAt: track.playedAt,
          lastFmData: track.lastFmData,
          spotifyData: track.spotifyData,
          youtubeData: transformedYouTube
        };
      }

      // No YouTube match found, return original track
      return {
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        albumArt: track.albumArt,
        previewUrl: track.previewUrl,
        spotifyUrl: track.spotifyUrl,
        isPlaying: track.isPlaying,
        playedAt: track.playedAt,
        lastFmData: track.lastFmData,
        spotifyData: track.spotifyData
      };

    } catch (error) {
      setError(error instanceof Error ? error.message : 'YouTube API error');
      
      // Return original track on error
      return {
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        albumArt: track.albumArt,
        previewUrl: track.previewUrl,
        spotifyUrl: track.spotifyUrl,
        isPlaying: track.isPlaying,
        playedAt: track.playedAt,
        lastFmData: track.lastFmData,
        spotifyData: track.spotifyData
      };
    }
  }, [apiKey, enabled]);

  // Enhance multiple tracks
  const enhanceTracksWithYouTube = useCallback(async (
    tracks: any[]
  ): Promise<EnhancedTrackWithYouTube[]> => {
    setIsLoading(true);
    try {
      const enhanced = await Promise.all(
        tracks.map(track => enhanceTrackWithYouTube(track))
      );
      return enhanced;
    } finally {
      setIsLoading(false);
    }
  }, [enhanceTrackWithYouTube]);

  return {
    isLoading,
    error,
    isEnabled: enabled && !!apiKey,
    enhanceTrackWithYouTube,
    enhanceTracksWithYouTube
  };
};