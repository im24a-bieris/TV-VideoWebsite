import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = typeof user.user_metadata.first_name === "string" ? user.user_metadata.first_name : "";
  const lastName = typeof user.user_metadata.last_name === "string" ? user.user_metadata.last_name : "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || user.email;

  return (
    <main className="content-page">
      <section className="content-shell">
        <div className="page-heading">
          <p className="eyebrow">Konto</p>
          <h1 className="content-title">Willkommen, {displayName}</h1>
          <p className="content-subtitle">
            Du bist angemeldet und kannst jetzt deine Trainingsdaten und gespeicherten Übungen nutzen.
          </p>
        </div>

        <div className="upload-form">
          <dl className="account-details">
            <div>
              <dt>E-Mail</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>User-ID</dt>
              <dd>{user.id}</dd>
            </div>
          </dl>
        </div>

        <div className="account-actions">
          <Link href="/exercises" className="button button-primary">
            Übungen ansehen
          </Link>
          <Link href="/upload" className="button">
            Video hochladen
          </Link>
        </div>
      </section>
    </main>
  );
}
