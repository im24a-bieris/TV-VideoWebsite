"use client";

import { useTransition } from "react";
import { deleteVideo } from "./actions";

export function DeleteVideoButton({ videoId }: { videoId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("Video wirklich löschen? Dies kann nicht rückgängig gemacht werden.")) {
      return;
    }

    const formData = new FormData();
    formData.set("id", videoId);

    startTransition(() => {
      deleteVideo(formData);
    });
  }

  return (
    <button type="button" className="button button-danger" onClick={handleClick} disabled={isPending}>
      {isPending ? "Wird gelöscht..." : "Video löschen"}
    </button>
  );
}
