import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  tips: string | null;
  video_path: string;
  thumbnail_path: string | null;
  created_at: string | null;
};

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: videos, error } = await supabase
    .from("videos")
    .select("id,title,description,tips,video_path,thumbnail_path,created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="content-page">
      <section className="content-shell">
        <div className="page-heading page-heading-row">
          <div>
            <p className="eyebrow">Videos</p>
            <h1 className="content-title">Übungsvideos</h1>
            <p className="content-subtitle">Videos, Beschreibungen und Tipps aus dem Training.</p>
          </div>

          <Link href="/upload" className="button button-primary page-heading-action">
            Video hochladen
          </Link>
        </div>

        {error ? (
          <p className="form-message form-message-error" role="alert">
            Videos konnten nicht geladen werden. Prüfe deine Supabase-Policies.
          </p>
        ) : null}

        {!error && (!videos || videos.length === 0) ? (
          <div className="empty-state">
            <h2>Noch keine Videos</h2>
            <p>Lade das erste Übungsvideo hoch.</p>
            <Link href="/upload" className="button button-primary">
              Erstes Video hochladen
            </Link>
          </div>
        ) : null}

        <div className="video-grid">
          {await Promise.all(
            (videos as VideoRow[] | null)?.map(async (video) => {
              const { data: thumbnailSignedUrl } = video.thumbnail_path
                ? await createAdminClient().storage.from("images").createSignedUrl(video.thumbnail_path, 3600)
                : { data: null };
              const thumbnailUrl = thumbnailSignedUrl?.signedUrl ?? null;

              return (
                <Link key={video.id} href={`/videos/${video.id}`} className="video-card">
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnailUrl} alt="" className="video-card-image" />
                  ) : (
                    <div className="video-card-placeholder">Video</div>
                  )}

                  <div className="video-card-body">
                    <h2>{video.title}</h2>
                    <p>{video.description}</p>
                  </div>
                </Link>
              );
            }) ?? []
          )}
        </div>

        <Link href="/" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
