import Link from "next/link";
import "../global.css";
import { register } from "../auth/actions";

export default function RegisterPage() {
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
            Erstelle dein Konto, um Übungen zu speichern und deinen Trainingsfortschritt zu verfolgen.
          </p>

          <form action={register} className="login-form">
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
              <input name="email" type="email" required placeholder="name@beispiel.ch" />
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
