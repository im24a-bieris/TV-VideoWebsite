import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Geräteturnen</p>
          <h1 className="title">Trainieren. Lernen. Weiterkommen.</h1>
          <p className="subtitle">
            Eine Website, die dir hilft, neue Teile zu lernen.
          </p>
        </div>

        <div className="hero-side">
          <div className="hero-logo" aria-hidden="true" />
        </div>

        <div className="button-group">
          <Link href="/exercises" className="button">
            Übungen ansehen
          </Link>
          <Link href="/login" className="button">
            Login
          </Link>
          <Link href="/register" className="button button-light">
            Registrieren
          </Link>
        </div>
      </section>
    </main>
  );
}
