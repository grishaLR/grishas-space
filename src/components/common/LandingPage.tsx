import { FC, useState, useEffect } from "react";
import { AudioPlayer3D } from "@components/AudioPlayer/AudioPlayer3D";
import { useLastFm } from "@hooks/useLastFm";
import { LASTFM_CONFIG, YOUTUBE_CONFIG } from "@/config/lastfm";
import styles from "./LandingPage.module.css";
import { Box } from "@components/primitives";

export const LandingPage: FC = () => {
  // Last.fm data
  const {
    currentTrack: lastFmCurrent,
    recentTracks: lastFmRecent,
    isLoading,
    error,
  } = useLastFm({
    username: LASTFM_CONFIG.USERNAME,
    apiKey: LASTFM_CONFIG.API_KEY,
    updateInterval: LASTFM_CONFIG.UPDATE_INTERVAL,
    useDemo: LASTFM_CONFIG.USE_DEMO,
  });

  // YouTube integration (now on-demand only in AudioPlayer)

  // Simply pass Last.fm data directly to AudioPlayer (no pre-loading YouTube)
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);

  useEffect(() => {
    setCurrentTrack(lastFmCurrent);
    setRecentTracks(lastFmRecent);
  }, [lastFmCurrent, lastFmRecent]);

  const handleTrackSelect = (track: any) => {
    console.log("🎵 User selected track:", track.name, "by", track.artist);
    setCurrentTrack(track);
  };

  return (
    <div className={styles.landing}>
      <div className={styles.header}>
        <Box
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={styles.profilePic} style={{ marginRight: "20px" }}>
            <img src="/assets/homer_nerd.png" alt="Profile" />
          </div>
          <h1 className={styles.title}>
            <span className={styles.glitch} data-text="GRISHA'S SPACE">
              GRISHA'S SPACE
            </span>
          </h1>
        </Box>
        <p className={styles.subtitle}>
          ✨ Welcome to my corner of the internet ✨
        </p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.sections}>
          {error && (
            <div
              style={{
                color: "var(--primary-green)",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              Last.fm Error: {error}
            </div>
          )}

          {currentTrack && (
            <AudioPlayer3D
              currentTrack={{
                id: currentTrack.id,
                name: currentTrack.name,
                artist: currentTrack.artist,
                album: currentTrack.album,
                albumArt: currentTrack.albumArt,
              }}
              recentTracks={recentTracks.map((track) => ({
                id: track.id,
                name: track.name,
                artist: track.artist,
                album: track.album,
                albumArt: track.albumArt,
              }))}
              onTrackSelect={handleTrackSelect}
            />
          )}

          {isLoading && (
            <div
              style={{
                color: "var(--text-secondary)",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              Loading your music data...
            </div>
          )}

          <div
            style={{
              color: "var(--primary-purple)",
              textAlign: "center",
              margin: "10px 0",
              fontSize: "0.9rem",
            }}
          >
            🍎 Apple Music integration enabled - authorize and play songs for
            audio visualization
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          © 2025 Grisha's Space | Powered by{" "}
          <img
            src="/assets/github-logo.svg"
            alt="GitHub"
            style={{
              width: "16px",
              height: "16px",
              display: "inline",
              verticalAlign: "text-bottom",
              marginRight: "4px",
            }}
          />
          @grishaLR
        </p>
      </div>
    </div>
  );
};
