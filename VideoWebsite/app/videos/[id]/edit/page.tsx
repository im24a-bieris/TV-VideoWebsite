import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateVideo } from "../../actions";
import { DeleteVideoButton } from "../../delete-video-button";

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  tips: string | null;
  user_id: string;
};

const editMessages: Record<string, string> = {
  "missing-fields": "Bitte fülle Titel, Beschreibung und Tipps aus.",
  update: "Video konnte nicht aktualisiert werden.",
  delete: "Video konnte nicht gelöscht werden.",
};

type EditVideoPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditVideoPage({ params, searchParams }: EditVideoPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: video, error: fetchError } = await supabase
    .from("videos")
    .select("id,title,description,tips,user_id")
    .eq("id", id)
    .single();

  if (fetchError || !video) {
    notFound();
  }

  const videoRow = video as VideoRow;

  if (videoRow.user_id !== user.id) {
    redirect(`/videos/${id}`);
  }

  const errorMessage = error ? editMessages[error] : undefined;

  return (
    <main className="content-page">
      <section className="content-shell">
        <div className="page-heading">
          <p className="eyebrow">Video bearbeiten</p>
          <h1 className="content-title">{videoRow.title}</h1>
        </div>

        <form action={updateVideo} className="upload-form">
          <input type="hidden" name="id" value={videoRow.id} />

          {errorMessage ? (
            <p className="form-message form-message-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <label>
            Titel
            <input name="title" type="text" required defaultValue={videoRow.title} />
          </label>

          <label>
            Beschreibung
            <textarea name="description" required rows={6} defaultValue={videoRow.description ?? ""} />
          </label>

          <label>
            Tipps und Tricks
            <textarea name="tips" required rows={5} defaultValue={videoRow.tips ?? ""} />
          </label>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Änderungen speichern
            </button>
          </div>
        </form>

        <div className="account-actions">
          <DeleteVideoButton videoId={videoRow.id} />
        </div>

        <Link href={`/videos/${videoRow.id}`} className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
