import Link from "next/link";
import "../global.css";
import { requestPasswordReset } from "../auth/actions";

const forgotMessages: Record<string, string> = {
  "missing-fields": "Bitte gib deine E-Mail-Adresse ein.",
  config: "Supabase ist noch nicht korrekt konfiguriert.",
};

const forgotStatusMessages: Record<string, string> = {
  "check-email": "Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error, message } = await searchParams;
  const errorMessage = error ? forgotMessages[error] : undefined;
  const statusMessage = message ? forgotStatusMessages[message] : undefined;

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
            <h1 className="title">Passwort vergessen</h1>
          </div>

          <p className="subtitle">
            Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link, um ein neues Passwort festzulegen.
          </p>

          <form action={requestPasswordReset} className="login-form">
            {errorMessage ? (
              <p className="form-message form-message-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {statusMessage ? <p className="form-message form-message-success">{statusMessage}</p> : null}

            <label>
              E-Mail-Adresse
              <input name="email" type="email" required placeholder="name@beispiel.ch" />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                Link anfordern
              </button>
            </div>
          </form>

          <div className="login-footer">
            <Link href="/login" className="auth-link">
              Zurück zum Login
            </Link>
          </div>
        </div>

        <Link href="/login" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
