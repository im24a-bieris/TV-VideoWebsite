"use client";

import { useState } from "react";

type VideoThumbnailProps = {
  src: string;
  alt: string;
};

function PlaceholderIcon() {
  return (
    <div className="video-card-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

export function VideoThumbnail({ src, alt }: VideoThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <PlaceholderIcon />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="video-card-image" onError={() => setFailed(true)} />;
}
