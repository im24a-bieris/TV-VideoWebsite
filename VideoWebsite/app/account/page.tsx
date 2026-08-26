import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

const profileMessages: Record<string, string> = {
  profile: "Profil konnte nicht gespeichert werden.",
};

const profileStatusMessages: Record<string, string> = {
  "profile-saved": "Profil wurde gespeichert.",
};

type AccountPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { error, message } = await searchParams;
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
  const phone = typeof user.user_metadata.phone === "string" ? user.user_metadata.phone : "";
  const instagram = typeof user.user_metadata.instagram === "string" ? user.user_metadata.instagram : "";

  const errorMessage = error ? profileMessages[error] : undefined;
  const statusMessage = message ? profileStatusMessages[message] : undefined;

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
              <dt>Telefonnummer</dt>
              <dd>{phone || "Nicht angegeben"}</dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>{instagram || "Nicht angegeben"}</dd>
            </div>
          </dl>
        </div>

        <form action={updateProfile} className="upload-form">
          <h2>Profil ergänzen</h2>
          <p className="content-subtitle">
            Freiwillig: Telefonnummer und Instagram werden auf deinem öffentlichen Profil angezeigt, damit andere dich
            erreichen können.
          </p>

          {errorMessage ? (
            <p className="form-message form-message-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {statusMessage ? <p className="form-message form-message-success">{statusMessage}</p> : null}

          <label>
            Telefonnummer
            <input name="phone" type="tel" defaultValue={phone} placeholder="079 123 45 67" />
          </label>

          <label>
            Instagram
            <input name="instagram" type="text" defaultValue={instagram} placeholder="@dein.handle" />
          </label>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Speichern
            </button>
          </div>
        </form>

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
