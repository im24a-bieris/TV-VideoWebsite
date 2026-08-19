import Link from "next/link";
import "../global.css";
import { register } from "../auth/actions";

const registerMessages: Record<string, string> = {
  passwords: "Die Passwörter stimmen nicht überein.",
  "email-exists": "Diese E-Mail-Adresse ist bereits registriert.",
  register: "Registrierung fehlgeschlagen. Bitte prüfe deine Angaben.",
  "missing-fields": "Bitte fülle alle Felder aus.",
  "password-short": "Das Passwort muss mindestens 8 Zeichen lang sein.",
  invalid: "Diese E-Mail-Adresse wird von Supabase nicht akzeptiert. Verwende eine echte, erreichbare Adresse.",
  "rate-limit": "Zu viele Registrierungsversuche. Bitte warte einige Minuten und versuche es erneut.",
  config: "Supabase ist noch nicht korrekt konfiguriert.",
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? registerMessages[error] : undefined;

  return (
    <main>
      <section className="login-page">
        <div className="login-card register-card">
          <div className="login-brand">
            <Link href="/" className="brand-icon-login">
              TV Männedorf
            </Link>
          </div>

          <div className="card-header">
            <h1 className="title">Registrieren</h1>
          </div>

          <p className="subtitle">
            Erstelle dein Konto und starte direkt mit den Übungen.
          </p>

          <form action={register} className="login-form">
            {errorMessage ? (
              <p className="form-message form-message-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="register-grid">
              <label>
                Vorname
                <input name="firstName" type="text" required placeholder="Max" />
              </label>

              <label>
                Nachname
                <input name="lastName" type="text" required placeholder="Muster" />
              </label>
            </div>

            <label>
              E-Mail-Adresse
              <input name="email" type="email" required placeholder="max.mustermann@mail.ch" />
            </label>

            <label>
              Passwort
              <input name="password" type="password" required placeholder="Mindestens 8 Zeichen" />
            </label>

            <label>
              Passwort bestätigen
              <input name="passwordConfirm" type="password" required placeholder="Passwort wiederholen" />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                Konto erstellen
              </button>
            </div>
          </form>

          <div className="login-footer">
            <span>Schon ein Konto?</span>
            <Link href="/login" className="auth-link">
              Anmelden
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
