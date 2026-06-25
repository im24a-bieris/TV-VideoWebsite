import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "../auth/actions";
import { createClient } from "@/lib/supabase/server";
import "../global.css";

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
    <main className="account-page">
      <section className="account-shell">
        <div className="account-header">
          <Link href="/" className="brand">
            <span className="brand-icon">TV</span>
            TV Männedorf
          </Link>

          <form action={logout}>
            <button type="submit" className="button account-logout-button">
              Abmelden
            </button>
          </form>
        </div>

        <div className="account-panel">
          <p className="eyebrow">Konto</p>
          <h1 className="account-title">Willkommen, {displayName}</h1>
          <p className="account-subtitle">
            Du bist angemeldet und kannst jetzt deine Trainingsdaten und gespeicherten Übungen nutzen.
          </p>

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

          <div className="account-actions">
            <Link href="/exercises" className="button button-primary">
              Übungen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
