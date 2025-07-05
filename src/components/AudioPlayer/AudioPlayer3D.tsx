import { FC, Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { AudioVisualizer3D } from "./AudioVisualizer3D";
import { useAudioAnalyzer } from "@hooks/useAudioAnalyzer";
import { Box, Button } from "@components/primitives";
import {
  initializeMusicKit,
  authorizeAppleMusic,
  isAuthorized,
  searchAppleMusic,
  playSong,
  getPlaybackState,
  playPause,
} from "@/services/appleMusic";
import styles from "./AudioPlayer3D.module.css";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt?: string;
  appleMusicId?: string;
  appleMusicUrl?: string;
}

interface AudioPlayer3DProps {
  currentTrack?: Track;
  recentTracks?: Track[];
  onTrackSelect?: (track: Track) => void;
}

export const AudioPlayer3D: FC<AudioPlayer3DProps> = ({
  currentTrack,
  recentTracks = [],
  onTrackSelect,
}) => {
  const {
    audioRef,
    audioData,
    isPlaying: audioIsPlaying,
    togglePlay,
  } = useAudioAnalyzer();

  const [musicKitInitialized, setMusicKitInitialized] = useState(false);
  const [musicKitAuthorized, setMusicKitAuthorized] = useState(false);
  const [appleMusicTrack, setAppleMusicTrack] = useState<any>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [isPlayingAppleMusic, setIsPlayingAppleMusic] = useState(false);
  const [playbackState, setPlaybackState] = useState<any>(null);
  const [appleMusicAudioData, setAppleMusicAudioData] = useState<any>(null);

  // Audio analysis for Apple Music
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const isProcessingRef = useRef(false);

  // Default audio data to prevent null errors
  const defaultAudioData = {
    frequency: new Uint8Array(256),
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0,
  };

  // Initialize MusicKit on component mount
  useEffect(() => {
    const initMusicKit = async () => {
      try {
        await initializeMusicKit();
        setMusicKitInitialized(true);
        setMusicKitAuthorized(isAuthorized());
      } catch (error) {
        // Handle initialization error
      }
    };

    initMusicKit();
  }, []);

  // Monitor MusicKit playback state (only for full Apple Music, not previews)
  useEffect(() => {
    if (!musicKitInitialized) return;

    const interval = setInterval(() => {
      const state = getPlaybackState();
      setPlaybackState(state);

      // Health check: detect if playback has stopped unexpectedly
      if (appleMusicTrack && isPlayingAppleMusic && state && !state.isPlaying) {
        const audioElement = document.getElementById(
          "apple-music-player"
        ) as HTMLAudioElement;
        if (audioElement && audioElement.error) {
          // Reset and retry
          setAppleMusicTrack(null);
          setIsPlayingAppleMusic(false);
          setTimeout(() => {
            handlePlayAppleMusic();
          }, 1000);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [musicKitInitialized, appleMusicTrack, isPlayingAppleMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudioContext();
    };
  }, []);

  // Auto-play when track changes (from recently played selection)
  useEffect(() => {
    if (currentTrack && musicKitAuthorized) {
      // Check if this is a different track than what's currently loaded
      if (
        !appleMusicTrack ||
        appleMusicTrack.attributes.name !== currentTrack.name ||
        appleMusicTrack.attributes.artistName !== currentTrack.artist
      ) {
        console.log("🎵 New track selected, auto-playing:", currentTrack.name);
        // Reset current Apple Music track to force a new search and play
        setAppleMusicTrack(null);
        // Small delay to ensure state is reset
        setTimeout(() => {
          handlePlayAppleMusic();
        }, 100);
      }
    }
  }, [currentTrack?.id]); // Trigger when track ID changes

  // Remove the sync effect - it's causing conflicts

  const handleAuthorizeAppleMusic = async () => {
    if (!musicKitInitialized) return;

    try {
      await authorizeAppleMusic();
      setMusicKitAuthorized(true);
    } catch (error) {
      // Handle authorization error
    }
  };

  const cleanupAudioContext = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyzerRef.current = null;
    setAppleMusicAudioData(null);
  };

  const handlePlayAppleMusic = async () => {
    if (isProcessingRef.current) {
      console.log("🔄 Already processing, skipping...");
      return;
    }

    isProcessingRef.current = true;

    console.log("🎵 handlePlayAppleMusic called");
    console.log("currentTrack:", currentTrack);
    console.log("appleMusicTrack:", appleMusicTrack);
    console.log("musicKitAuthorized:", musicKitAuthorized);
    console.log("audioRef.current:", audioRef.current);

    if (!currentTrack) {
      console.log("❌ No current track");
      isProcessingRef.current = false;
      return;
    }

    // If we already have Apple Music track, just toggle play state
    if (appleMusicTrack) {
      console.log(
        "🔄 Toggling existing track, isPlaying:",
        isPlayingAppleMusic
      );
      try {
        const musicKit = window.MusicKit.getInstance();
        const player = musicKit.player || musicKit;

        if (isPlayingAppleMusic) {
          if (player.pause) {
            await player.pause();
          } else if (musicKit.pause) {
            await musicKit.pause();
          }
          setIsPlayingAppleMusic(false);
          console.log("⏸ Paused MusicKit");
        } else {
          if (player.play) {
            await player.play();
          } else if (musicKit.play) {
            await musicKit.play();
          }
          setIsPlayingAppleMusic(true);
          console.log("▶ Playing MusicKit");
        }
      } catch (error) {
        console.error("❌ Error toggling MusicKit playback:", error);
        // If playback fails, try to refresh and restart
        if (
          error.message?.includes("network") ||
          error.message?.includes("blob") ||
          error.message?.includes("AbortError") ||
          error.message?.includes("NotAllowedError")
        ) {
          console.log(
            "🔄 Blob/network error detected, attempting to restart track..."
          );
          setAppleMusicTrack(null);
          setIsPlayingAppleMusic(false);
          setTimeout(() => {
            handlePlayAppleMusic();
          }, 500);
        }
      }
      isProcessingRef.current = false;
      return;
    }

    // Need to authorize first
    if (!musicKitAuthorized) {
      console.log("🔐 Need authorization first");
      await handleAuthorizeAppleMusic();
      isProcessingRef.current = false;
      return;
    }

    console.log("🔍 Starting search and play...");
    setLoadingTrack(true);
    try {
      // Search for the track on Apple Music
      const searchQuery = `${currentTrack.artist} ${currentTrack.name}`;
      console.log("🔍 Search query:", searchQuery);

      const results = await searchAppleMusic(searchQuery);
      console.log("🔍 Search results:", results);

      // Check different possible result structures
      let songs = null;
      if (results?.results?.songs?.data) {
        songs = results.results.songs.data;
      } else if (results?.data?.results?.songs?.data) {
        songs = results.data.results.songs.data;
      } else if (results?.songs?.data) {
        songs = results.songs.data;
      }

      console.log("📦 Parsed songs:", songs);

      if (songs && songs.length > 0) {
        const song = songs[0];
        console.log(
          "🎵 Found song:",
          song.attributes.name,
          "by",
          song.attributes.artistName
        );

        // Clean up any existing audio context before setting up a new one
        cleanupAudioContext();
        setAppleMusicTrack(song);

        // Use full Apple Music playback instead of previews
        console.log(
          "🎵 Playing full song via MusicKit:",
          song.attributes.playParams.id
        );

        try {
          // Play the full song using MusicKit
          const musicKit = window.MusicKit.getInstance();

          console.log("🎛 MusicKit instance:", musicKit);
          console.log(
            "🎛 MusicKit methods:",
            Object.getOwnPropertyNames(musicKit)
          );
          console.log("🎛 MusicKit player:", musicKit.player);

          // Check if we need to access the player differently
          const player = musicKit.player || musicKit;

          // Try different queue setting methods
          if (player.setQueue) {
            await player.setQueue({
              song: song.attributes.playParams.id,
            });
          } else if (musicKit.setQueue) {
            await musicKit.setQueue({
              song: song.attributes.playParams.id,
            });
          } else {
            throw new Error("No setQueue method found");
          }

          // Try different play methods
          if (player.play) {
            await player.play();
          } else if (musicKit.play) {
            await musicKit.play();
          } else {
            throw new Error("No play method found");
          }

          setIsPlayingAppleMusic(true);
          console.log("✅ MusicKit playback started");

          // Setup audio analyzer for MusicKit player
          // Find the actual audio element that MusicKit is using
          let audioElement = null;

          // Debug: Explore the MusicKit structure
          console.log("🔍 _playbackController:", musicKit._playbackController);
          console.log("🔍 _services:", musicKit._services);
          console.log("🔍 _queue:", musicKit._queue);

          // Look for all audio elements in DOM
          const allAudioElements = document.querySelectorAll("audio");
          console.log("🔍 All audio elements in DOM:", allAudioElements);

          // Check different possible locations for the audio element
          if (
            musicKit._playbackController &&
            musicKit._playbackController.audioElement
          ) {
            audioElement = musicKit._playbackController.audioElement;
            console.log("🎵 Found audio element in _playbackController");
          } else if (
            musicKit._services &&
            musicKit._services.media &&
            musicKit._services.media.player
          ) {
            audioElement = musicKit._services.media.player;
            console.log("🎵 Found audio element in _services.media.player");
          } else {
            // Look for any audio elements in the DOM that MusicKit might have created
            for (let audio of allAudioElements) {
              console.log("🔍 Audio element:", audio, "src:", audio.src);
              if (
                audio.id === "apple-music-player" ||
                (audio.src &&
                  (audio.src.includes("blob:") ||
                    audio.src.includes("mzstatic") ||
                    audio.src.includes("apple"))) ||
                audio.currentTime > 0
              ) {
                audioElement = audio;
                console.log(
                  "🎵 Found MusicKit audio element:",
                  audio.id || "no-id"
                );
                break;
              }
            }
          }

          console.log("🎵 Audio element found:", audioElement);

          if (!audioContextRef.current && audioElement) {
            try {
              // Wait a bit for the audio to actually start playing
              setTimeout(async () => {
                try {
                  const audioContext = new (window.AudioContext ||
                    (window as any).webkitAudioContext)();

                  // Resume context if suspended (required for user interaction)
                  if (audioContext.state === "suspended") {
                    await audioContext.resume();
                    console.log("🔊 Audio context resumed");
                  }

                  const analyzer = audioContext.createAnalyser();
                  analyzer.fftSize = 512; // Increased for better resolution
                  analyzer.smoothingTimeConstant = 0.8;

                  console.log(
                    "🎵 Creating audio source for element:",
                    audioElement
                  );
                  console.log("🎵 Audio element properties:", {
                    src: audioElement.src,
                    currentTime: audioElement.currentTime,
                    duration: audioElement.duration,
                    volume: audioElement.volume,
                    muted: audioElement.muted,
                    paused: audioElement.paused,
                    readyState: audioElement.readyState,
                  });

                  // Check if the audio element already has a source node attached
                  let source;
                  try {
                    source =
                      audioContext.createMediaElementSource(audioElement);
                    console.log("✅ Successfully created MediaElementSource");
                  } catch (error) {
                    console.error(
                      "❌ Failed to create MediaElementSource (might already be connected):",
                      error
                    );

                    // Try alternative approach: use a MediaStreamSource
                    try {
                      if (audioElement.captureStream) {
                        const stream = audioElement.captureStream();
                        source = audioContext.createMediaStreamSource(stream);
                        console.log("✅ Using MediaStreamSource instead");
                      } else {
                        throw new Error("captureStream not supported");
                      }
                    } catch (streamError) {
                      console.error(
                        "❌ MediaStreamSource also failed:",
                        streamError
                      );

                      // Last resort: try to clone the audio element
                      const clonedAudio = audioElement.cloneNode(
                        true
                      ) as HTMLAudioElement;
                      clonedAudio.src = audioElement.src;
                      clonedAudio.currentTime = audioElement.currentTime;
                      clonedAudio.volume = 0; // Silent clone for analysis only
                      clonedAudio.play();

                      source =
                        audioContext.createMediaElementSource(clonedAudio);
                      console.log("✅ Using cloned audio element");
                    }
                  }

                  if (source) {
                    source.connect(analyzer);
                    // Only connect to destination if it's not already connected elsewhere
                    try {
                      analyzer.connect(audioContext.destination);
                    } catch (destError) {
                      console.warn(
                        "⚠️ Could not connect to destination (might already be connected)"
                      );
                    }
                  }

                  audioContextRef.current = audioContext;
                  analyzerRef.current = analyzer;

                  console.log("🎨 MusicKit audio analyzer connected");
                  console.log("🎨 Analyzer properties:", {
                    fftSize: analyzer.fftSize,
                    frequencyBinCount: analyzer.frequencyBinCount,
                    minDecibels: analyzer.minDecibels,
                    maxDecibels: analyzer.maxDecibels,
                  });

                  // Start analyzing
                  const updateAudioData = () => {
                    if (!analyzerRef.current) return;

                    const bufferLength = analyzerRef.current.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    // Try both frequency and time domain data
                    analyzerRef.current.getByteFrequencyData(dataArray);
                    const timeArray = new Uint8Array(bufferLength);
                    analyzerRef.current.getByteTimeDomainData(timeArray);

                    // Check if we're getting any data
                    const totalValue = dataArray.reduce((a, b) => a + b);
                    const totalTimeValue = timeArray.reduce((a, b) => a + b);

                    // Calculate volume and frequency bands
                    const volume = totalValue / bufferLength / 255;
                    const bass =
                      dataArray.slice(0, 32).reduce((a, b) => a + b) / 32 / 255;
                    const mid =
                      dataArray.slice(32, 128).reduce((a, b) => a + b) /
                      96 /
                      255;
                    const treble =
                      dataArray.slice(128, 256).reduce((a, b) => a + b) /
                      128 /
                      255;

                    setAppleMusicAudioData({
                      frequency: dataArray,
                      volume,
                      bass,
                      mid,
                      treble,
                    });

                    // Always continue the loop while we have an analyzer, regardless of play state
                    if (analyzerRef.current) {
                      animationRef.current =
                        requestAnimationFrame(updateAudioData);
                    }
                  };

                  // Manually start the analysis loop
                  console.log("🎬 Starting audio analysis loop");
                  updateAudioData();

                  // Also set up a backup interval to ensure it keeps running
                  const analysisInterval = setInterval(() => {
                    if (isPlayingAppleMusic && analyzerRef.current) {
                      updateAudioData();
                    } else {
                      clearInterval(analysisInterval);
                    }
                  }, 16); // ~60fps
                } catch (innerError) {
                  console.error(
                    "❌ Failed to create delayed audio context:",
                    innerError
                  );
                }
              }, 1000); // Wait 1 second for audio to stabilize
            } catch (error) {
              console.error(
                "❌ Failed to create MusicKit audio context:",
                error
              );
            }
          }
        } catch (error) {
          console.error("❌ MusicKit playback failed:", error);

          // Check if it's a token/authorization issue
          if (
            error.message?.includes("unauthorized") ||
            error.message?.includes("token") ||
            error.message?.includes("403") ||
            error.message?.includes("401")
          ) {
            console.log("🔐 Authorization issue detected, re-authorizing...");
            setMusicKitAuthorized(false);
            try {
              await handleAuthorizeAppleMusic();
              // Retry playback after re-authorization
              setTimeout(() => {
                handlePlayAppleMusic();
              }, 1000);
            } catch (authError) {
              console.error("❌ Re-authorization failed:", authError);
            }
          } else {
            // Other errors - try to restart the track
            console.log("🔄 Playback error, attempting to restart...");
            setAppleMusicTrack(null);
            setTimeout(() => {
              handlePlayAppleMusic();
            }, 1000);
          }
        }
      } else {
        console.log("❌ No songs found in search results");
      }
    } catch (error) {
      console.error("❌ Error in handlePlayAppleMusic:", error);
    } finally {
      setLoadingTrack(false);
      isProcessingRef.current = false;
      console.log("🏁 handlePlayAppleMusic finished");
    }
  };

  return (
    <Box className={styles.container}>
      <div
        className={styles.visualizer}
        style={{ cursor: "grab" }}
        onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
        onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
        onMouseLeave={(e) => (e.currentTarget.style.cursor = "grab")}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#9b59b6" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#2ecc71"
          />

          <Suspense fallback={null}>
            <AudioVisualizer3D
              audioData={appleMusicAudioData || audioData || defaultAudioData}
              isPlaying={isPlayingAppleMusic || audioIsPlaying}
            />
          </Suspense>

          <Environment preset="night" />
        </Canvas>
      </div>

      <div className={styles.controls}>
        {currentTrack ? (
          <>
            {currentTrack.albumArt && (
              <img
                src={currentTrack.albumArt}
                alt={`${currentTrack.album} album art`}
                className={styles.albumArt}
              />
            )}

            <div className={styles.trackDetails}>
              <div className={styles.trackInfo}>
                <h3>{currentTrack.name}</h3>
                <p>
                  {currentTrack.artist} • {currentTrack.album}
                </p>
              </div>

              <Button
                variant="grishas-space"
                onClick={handlePlayAppleMusic}
                className={styles.playButton}
                disabled={loadingTrack}
              >
                {loadingTrack
                  ? "🔍 Finding Song..."
                  : !musicKitAuthorized
                  ? "🍎 Authorize Apple Music"
                  : appleMusicTrack
                  ? isPlayingAppleMusic
                    ? "⏸ Pause"
                    : "▶ Play Song"
                  : "▶ Find & Play Song"}
              </Button>
            </div>
          </>
        ) : (
          <p className={styles.noTrack}>No track currently playing</p>
        )}
      </div>

      {recentTracks.length > 0 && (
        <div className={styles.recentTracks}>
          <h4>Recently Played</h4>
          <div className={styles.trackList}>
            {recentTracks.map((track) => (
              <div
                key={track.id}
                className={styles.recentTrack}
                onClick={() => onTrackSelect?.(track)}
                style={{ cursor: onTrackSelect ? "pointer" : "default" }}
              >
                {track.albumArt && (
                  <img
                    src={track.albumArt}
                    alt={`${track.album} album art`}
                    className={styles.recentTrackArt}
                  />
                )}

                <div className={styles.recentTrackInfo}>
                  <span className={styles.trackName}>{track.name}</span>
                  <span className={styles.trackArtist}>{track.artist}</span>
                </div>

                <div className={styles.playIcon}>▶</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apple Music player info */}
      {appleMusicTrack && playbackState && (
        <div className={styles.appleMusicPlayer}>
          <div className={styles.playbackInfo}>
            <p>🍎 Playing from Apple Music</p>
            {playbackState.nowPlaying && (
              <p>
                {playbackState.nowPlaying.title} by{" "}
                {playbackState.nowPlaying.artistName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden audio element for preview playback */}
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
    </Box>
  );
};
