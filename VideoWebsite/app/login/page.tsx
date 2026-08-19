import Link from "next/link";
import "../global.css";
import { login } from "../auth/actions";

const loginMessages: Record<string, string> = {
  credentials: "E-Mail oder Passwort ist falsch.",
  "missing-fields": "Bitte fülle E-Mail und Passwort aus.",
  config: "Supabase ist noch nicht korrekt konfiguriert.",
};

const statusMessages: Record<string, string> = {
  "logged-out": "Du wurdest abgemeldet.",
  "check-email": "Bitte bestätige zuerst deine E-Mail-Adresse und melde dich danach an.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;
  const errorMessage = error ? loginMessages[error] : undefined;
  const statusMessage = message ? statusMessages[message] : undefined;

  return (
    <main>
      <section className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <Link href="/" className="brand-icon-login">
              TV Männedorf
            </Link>
          </div>

          <div className="card-header">
            <h1 className="title">Anmelden</h1>
          </div>

          <p className="subtitle">
            Melde dich mit deiner E-Mail und deinem Passwort an, um deine Übungen zu entdecken.
          </p>

          <form action={login} className="login-form">
            {errorMessage ? (
              <p className="form-message form-message-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {statusMessage ? (
              <p className="form-message form-message-success">{statusMessage}</p>
            ) : null}

            <label>
              E-Mail-Adresse
              <input name="email" type="email" required placeholder="name@beispiel.ch" />
            </label>

            <label>
              Passwort
              <input name="password" type="password" required placeholder="********" />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                Anmelden
              </button>
            </div>
          </form>

          <div className="login-footer">
            <span>Kein Konto?</span>
            <Link href="/register" className="auth-link">
              Registrieren
            </Link>
            <span>oder</span>
            <Link href="/exercises" className="auth-link">
              als Gast starten
            </Link>
          </div>
        </div>

        <Link href="/" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
