import { useState, useEffect, useCallback } from 'react';
import { 
  getRecentTracks, 
  getCurrentTrack, 
  transformLastFmTrack, 
  LastFmTrack,
  getDemoLastFmData 
} from '@/services/lastfmApi';

interface UseLastFmOptions {
  username?: string;
  apiKey?: string;
  updateInterval?: number; // in milliseconds
  useDemo?: boolean;
}

interface TransformedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt?: string;
  url?: string;
  isPlaying: boolean;
  playedAt?: Date;
}

export const useLastFm = ({
  username,
  apiKey,
  updateInterval = 30000, // 30 seconds
  useDemo = true
}: UseLastFmOptions = {}) => {
  const [currentTrack, setCurrentTrack] = useState<TransformedTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<TransformedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    
    if (useDemo || !username || !apiKey) {
      // Use demo data
      const demoData = getDemoLastFmData();
      setCurrentTrack(demoData[0]);
      setRecentTracks(demoData.slice(1));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch recent tracks
      const tracks = await getRecentTracks(username, apiKey, 10);
      
      if (tracks.length === 0) {
        setCurrentTrack(null);
        setRecentTracks([]);
        return;
      }

      const transformedTracks = tracks.map(transformLastFmTrack);
      
      // Find currently playing track
      const nowPlaying = transformedTracks.find(track => track.isPlaying);
      setCurrentTrack(nowPlaying || transformedTracks[0] || null);
      
      // Set recent tracks (excluding currently playing)
      const recent = transformedTracks.filter(track => !track.isPlaying);
      setRecentTracks(recent);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [username, apiKey, useDemo]);

  // Initial fetch
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (useDemo) return; // Don't poll for demo data

    const interval = setInterval(fetchTracks, updateInterval);
    return () => clearInterval(interval);
  }, [fetchTracks, updateInterval, useDemo]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchTracks();
  }, [fetchTracks]);

  return {
    currentTrack,
    recentTracks,
    isLoading,
    error,
    refresh
  };
};