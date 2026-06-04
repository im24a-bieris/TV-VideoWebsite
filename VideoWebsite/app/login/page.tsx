import Link from "next/link";
import "../global.css";

export default function LoginPage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand logo-link">
          <span className="brand-icon">M</span>
          TV Männedorf
        </Link>

        <nav className="nav">
          <Link href="/exercises">Als Gast weiterfahren</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>

      <section className="login-page">
        <div className="login-card">
          <div className="card-header">
            <span className="eyebrow">Mitglieds-Login</span>
            <h1 className="title">Anmelden</h1>
          </div>

          <p className="subtitle">
            Melde dich mit deiner E-Mail und deinem Passwort an, um alle Trainingsdaten zu sehen.
          </p>

          <form className="login-form">
            <label>
              E-Mail-Adresse
              <input type="email" placeholder="name@beispiel.ch" />
            </label>

            <label>
              Passwort
              <input type="password" placeholder="••••••••" />
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
      </section>
    </main>
  );
}
