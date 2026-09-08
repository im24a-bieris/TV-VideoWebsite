"use client";

import { useState } from "react";

type VideoPlayerProps = {
  src: string;
};

export function VideoPlayer({ src }: VideoPlayerProps) {
  const [failed, setFailed] = useState(false);

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

  return (
    <video className="video-player" src={src} controls preload="metadata" onError={() => setFailed(true)} />
  );
}
