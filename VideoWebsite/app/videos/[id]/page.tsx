import Link from "next/link";
import { notFound } from "next/navigation";
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
  user_id: string;
};

type VideoImageRow = {
  id: string;
  image_path: string;
  sort_order: number | null;
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

  const { data: images } = await supabase
    .from("video_images")
    .select("id,image_path,sort_order")
    .eq("video_id", id)
    .order("sort_order", { ascending: true });

  const videoRow = video as VideoRow;
  const adminSupabase = createAdminClient();
  const { data: videoSignedUrl, error: videoUrlError } = await adminSupabase.storage
    .from("videos")
    .createSignedUrl(videoRow.video_path, 3600);

  if (videoUrlError || !videoSignedUrl?.signedUrl) {
    notFound();
  }

  return (
    <main className="content-page">
      <section className="content-shell video-detail">
        <div className="page-heading">
          <p className="eyebrow">Übungsvideo</p>
          <h1 className="content-title">{videoRow.title}</h1>
        </div>

        <video className="video-player" src={videoSignedUrl.signedUrl} controls preload="metadata" />

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

        {images && images.length > 0 ? (
          <section className="image-gallery" aria-label="Fotos zur Beschreibung">
            <h2>Fotos zur Beschreibung</h2>
            <div className="image-gallery-grid">
              {(images as VideoImageRow[]).map(async (image) => {
                const { data: imageSignedUrl } = await adminSupabase.storage
                  .from("images")
                  .createSignedUrl(image.image_path, 3600);

                return imageSignedUrl?.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={image.id} src={imageSignedUrl.signedUrl} alt="" className="gallery-image" />
                ) : null;
              })}
            </div>
          </section>
        ) : null}

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
