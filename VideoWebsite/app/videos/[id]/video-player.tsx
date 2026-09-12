"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
};

export function VideoPlayer({ src }: VideoPlayerProps) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (failed) {
    return (
      <div className="video-player video-player-fallback" role="alert">
        <p>Der Video-Link ist abgelaufen oder nicht erreichbar.</p>
        <button type="button" className="button button-light" onClick={() => window.location.reload()}>
          Seite neu laden
        </button>
      </div>
    );
  }

  function enforceMuted() {
    const video = videoRef.current;
    if (video && (!video.muted || video.volume !== 0)) {
      video.muted = true;
      video.volume = 0;
    }
  }

  return (
    <video
      ref={videoRef}
      className="video-player"
      src={src}
      controls
      muted
      preload="metadata"
      onError={() => setFailed(true)}
      onVolumeChange={enforceMuted}
      onLoadedMetadata={enforceMuted}
      onPlay={enforceMuted}
    />
  );
}
