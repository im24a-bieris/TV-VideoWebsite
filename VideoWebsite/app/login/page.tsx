import Link from "next/link";
import "../global.css";
import { login } from "../auth/actions";

export default function LoginPage() {
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
            Melde dich mit deiner E-Mail und deinem Passwort an, um alle Trainingsdaten zu sehen.
          </p>

          <form action={login} className="login-form">
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
