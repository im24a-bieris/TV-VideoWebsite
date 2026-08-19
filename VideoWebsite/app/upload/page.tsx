import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="content-page">
      <section className="content-shell">
        <div className="page-heading">
          <p className="eyebrow">Upload</p>
          <h1 className="content-title">Video hochladen</h1>
          <p className="content-subtitle">
            Lade dein Übungsvideo hoch und ergänze Beschreibung, Tipps und Fotos.
          </p>
        </div>

        <UploadForm />

        <Link href="/videos" className="back-link">
          &larr; Videos
        </Link>
      </section>
    </main>
  );
}
