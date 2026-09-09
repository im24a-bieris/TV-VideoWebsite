import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { VideoPlayer } from "./video-player";

export const dynamic = "force-dynamic";

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  tips: string | null;
  video_path: string;
  thumbnail_path: string | null;
  created_at: string | null;
  user_id: string;
};

type VideoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: video, error } = await supabase
    .from("videos")
    .select("id,title,description,tips,video_path,thumbnail_path,created_at,user_id")
    .eq("id", id)
    .single();

  if (error || !video) {
    notFound();
  }

  const videoRow = video as VideoRow;
  const adminSupabase = createAdminClient();
  const { data: videoSignedUrl, error: videoUrlError } = await adminSupabase.storage
    .from("videos")
    .createSignedUrl(videoRow.video_path, 3600);

  const videoUrl = videoSignedUrl?.signedUrl ?? null;
  const videoUnavailable = Boolean(videoUrlError) || !videoUrl;

  const { data: creatorData } = await adminSupabase.auth.admin.getUserById(videoRow.user_id);
  const creatorUser = creatorData?.user;
  const creatorFirstName =
    typeof creatorUser?.user_metadata.first_name === "string" ? creatorUser.user_metadata.first_name : "";
  const creatorLastName =
    typeof creatorUser?.user_metadata.last_name === "string" ? creatorUser.user_metadata.last_name : "";
  const creatorName = [creatorFirstName, creatorLastName].filter(Boolean).join(" ") || creatorUser?.email || "Mitglied";

  return (
    <main className="content-page">
      <section className="content-shell video-detail">
        <div className="page-heading">
          <p className="eyebrow">Video</p>
          <h1 className="content-title">{videoRow.title}</h1>
          <Link href={`/profile/${videoRow.user_id}`} className="creator-link">
            Hochgeladen von {creatorName}
          </Link>
        </div>

        {videoUnavailable ? (
          <p className="form-message form-message-error" role="alert">
            Das Video konnte nicht geladen werden. Bitte lade die Seite neu.
          </p>
        ) : (
          <VideoPlayer src={videoUrl} />
        )}

        <div className="video-detail-grid">
          <article className="info-panel">
            <h2>Beschreibung</h2>
            <p>{videoRow.description}</p>
          </article>

          <article className="info-panel">
            <h2>Tipps und Tricks</h2>
            <p>{videoRow.tips}</p>
          </article>
        </div>

        <div className="account-actions">
          <Link href="/videos" className="button">
            Alle Videos
          </Link>
          <Link href="/upload" className="button button-primary">
            Neues Video hochladen
          </Link>
          {user?.id === videoRow.user_id ? (
            <Link href={`/videos/${videoRow.id}/edit`} className="button button-secondary">
              Bearbeiten
            </Link>
          ) : null}
        </div>

        <Link href="/videos" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
