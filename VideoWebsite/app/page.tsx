import Link from "next/link";

export default function Home() {
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

      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Geräteturnen</p>
          <h1 className="title">Trainieren. Lernen. Weiterkommen.</h1>
          <p className="subtitle">
            Eine Webisite, die dir hilft, neue Teile zu lernen.
          </p>

          <div className="button-group">
            <Link href="/exercises" className="button">
              Übungen ansehen
            </Link>
            <Link href="/login" className="button">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-logo" aria-hidden="true" />
      </section>
    </main>
  );
}
