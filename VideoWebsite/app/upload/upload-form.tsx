"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension ? extension.replace(/[^a-z0-9]/g, "") : "bin";
}

function getUploadError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Upload fehlgeschlagen. Bitte versuche es noch einmal.";
}

export function UploadForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const title = String(formData.get("title") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      const tips = String(formData.get("tips") ?? "").trim();
      const video = formData.get("video");
      const images = formData
        .getAll("images")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0);

      if (!title || !description || !tips) {
        throw new Error("Bitte fülle Titel, Beschreibung und Tipps aus.");
      }

      if (!(video instanceof File) || video.size === 0) {
        throw new Error("Bitte wähle ein Video aus.");
      }

      if (!ALLOWED_VIDEO_TYPES.includes(video.type)) {
        throw new Error("Bitte lade ein MP4-, WebM- oder MOV-Video hoch.");
      }

      if (video.size > MAX_VIDEO_SIZE) {
        throw new Error("Das Video darf maximal 50 MB gross sein.");
      }

      for (const image of images) {
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          throw new Error("Fotos müssen JPG, PNG oder WebP sein.");
        }

        if (image.size > MAX_IMAGE_SIZE) {
          throw new Error("Ein Foto darf maximal 10 MB gross sein.");
        }
      }

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Bitte melde dich zuerst an.");
      }

      const videoId = crypto.randomUUID();
      const videoPath = `${user.id}/${videoId}/video.${getFileExtension(video)}`;
      const uploadedVideoPaths = [videoPath];
      const uploadedImagePaths: string[] = [];
      let videoRowCreated = false;

      try {
        const { error: videoUploadError } = await supabase.storage.from("videos").upload(videoPath, video, {
          cacheControl: "3600",
          contentType: video.type,
          upsert: false,
        });

        if (videoUploadError) throw videoUploadError;

        for (const [index, image] of images.entries()) {
          const imagePath = `${user.id}/${videoId}/${index + 1}-${crypto.randomUUID()}.${getFileExtension(image)}`;
          const { error: imageUploadError } = await supabase.storage.from("images").upload(imagePath, image, {
            cacheControl: "3600",
            contentType: image.type,
            upsert: false,
          });

          if (imageUploadError) throw imageUploadError;
          uploadedImagePaths.push(imagePath);
        }

        const { error: videoInsertError } = await supabase.from("videos").insert({
          id: videoId,
          user_id: user.id,
          title,
          description,
          tips,
          video_path: videoPath,
          thumbnail_path: uploadedImagePaths[0] ?? null,
        });

        if (videoInsertError) throw videoInsertError;
        videoRowCreated = true;

        if (uploadedImagePaths.length > 0) {
          const { error: imagesInsertError } = await supabase.from("video_images").insert(
            uploadedImagePaths.map((imagePath, index) => ({
              video_id: videoId,
              image_path: imagePath,
              sort_order: index,
            }))
          );

          if (imagesInsertError) throw imagesInsertError;
        }
      } catch (uploadError) {
        if (videoRowCreated) {
          await supabase.from("videos").delete().eq("id", videoId);
        }

        await Promise.all([
          supabase.storage.from("videos").remove(uploadedVideoPaths),
          uploadedImagePaths.length > 0 ? supabase.storage.from("images").remove(uploadedImagePaths) : Promise.resolve(),
        ]);
        throw uploadError;
      }

      router.push(`/videos/${videoId}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(getUploadError(error));
      setIsSubmitting(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      {errorMessage ? (
        <p className="form-message form-message-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <label>
        Titel
        <input name="title" type="text" required placeholder="z.B. Salto vorwärts" />
      </label>

      <label>
        Beschreibung
        <textarea name="description" required rows={6} placeholder="Beschreibe die Übung und worauf man achten soll." />
      </label>

      <label>
        Tipps und Tricks
        <textarea name="tips" required rows={5} placeholder="Schreibe deine wichtigsten Tipps auf." />
      </label>

      <label>
        Video
        <input name="video" type="file" required accept="video/mp4,video/webm,video/quicktime" />
        <small>MP4, WebM oder MOV, maximal 50 MB.</small>
      </label>

      <label>
        Fotos zur Beschreibung
        <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple />
        <small>JPG, PNG oder WebP, jeweils maximal 10 MB.</small>
      </label>

      <button type="submit" className="button button-primary upload-submit" disabled={isSubmitting}>
        {isSubmitting ? "Lädt hoch..." : "Video veröffentlichen"}
      </button>
    </form>
  );
}
