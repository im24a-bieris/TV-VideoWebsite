import Link from "next/link";
import "../global.css";

export default function LoginPage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand">
          TV Männedorf
        </Link>

        <nav className="nav">
          <Link href="/exercises">Als Gast weiterfahren</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>

      <section className="login-hero">
        <div className="login-card">
          <p className="eyebrow">Mitglieds-Login</p>
          <h1 className="title">Melde dich an</h1>
          <p className="subtitle">
            Gib deine Zugangsdaten ein, um deine Übungen und Ergebnisse zu sehen.
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

            <button type="submit" className="button login-button">
              Anmelden
            </button>
          </form>
        </div>

        <div className="login-side">
          <p className="text-xl font-semibold">Noch kein Konto?</p>
          <p className="text-gray-600 mb-6">
            Als Gast kannst du sofort weitertrainieren und die Übungen ansehen.
          </p>
          <Link href="/exercises" className="button">
            Als Gast starten
          </Link>
        </div>
      </section>
    </main>
  );
}