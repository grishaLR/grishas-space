import { useRef, useEffect, useState } from "react";

export interface AudioData {
  frequency: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

export const useAudioAnalyzer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [audioData, setAudioData] = useState<AudioData>({
    frequency: new Uint8Array(128),
    volume: 0,
    bass: 0,
    mid: 0,
    treble: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const setupAudioContext = () => {
      if (!audioRef.current || audioContextRef.current) return;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
      sourceRef.current = source;
    };

    const updateAudioData = () => {
      if (!analyzerRef.current) return;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzerRef.current.getByteFrequencyData(dataArray);

      // Calculate volume
      const volume = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      
      // Calculate frequency bands
      const bass = dataArray.slice(0, 16).reduce((a, b) => a + b) / 16 / 255;
      const mid = dataArray.slice(16, 64).reduce((a, b) => a + b) / 48 / 255;
      const treble = dataArray.slice(64, 128).reduce((a, b) => a + b) / 64 / 255;

      setAudioData({
        frequency: dataArray,
        volume,
        bass,
        mid,
        treble,
      });

      animationRef.current = requestAnimationFrame(updateAudioData);
    };

    if (isPlaying) {
      setupAudioContext();
      updateAudioData();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
      }
    }
  };

  return {
    audioRef,
    audioData,
    isPlaying,
    togglePlay,
  };
};