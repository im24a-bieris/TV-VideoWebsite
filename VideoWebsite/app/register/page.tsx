import Link from "next/link";
import "../global.css";

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

          <form className="login-form">
            <div className="register-grid">
              <label>
                Vorname
                <input type="text" placeholder="Max" />
              </label>

              <label>
                Nachname
                <input type="text" placeholder="Muster" />
              </label>
            </div>

            <label>
              E-Mail-Adresse
              <input type="email" placeholder="name@beispiel.ch" />
            </label>

            <label>
              Passwort
              <input type="password" placeholder="Mindestens 8 Zeichen" />
            </label>

            <label>
              Passwort bestätigen
              <input type="password" placeholder="Passwort wiederholen" />
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
