import Link from "next/link";
import "../global.css";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
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
            <h1 className="title">Neues Passwort</h1>
          </div>

          <p className="subtitle">Lege ein neues Passwort für dein Konto fest.</p>

          <ResetPasswordForm />
        </div>

        <Link href="/login" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
