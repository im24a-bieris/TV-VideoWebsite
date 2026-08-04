"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import "../global.css";
import { loginLocalUser } from "@/lib/auth/client";

const loginMessages: Record<string, string> = {
  credentials: "E-Mail oder Passwort ist falsch.",
  "missing-fields": "Bitte fülle E-Mail und Passwort aus.",
};

const statusMessages: Record<string, string> = {
  "logged-out": "Du wurdest abgemeldet.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    () => loginMessages[searchParams.get("error") ?? ""]
  );
  const [statusMessage, setStatusMessage] = useState<string | undefined>(
    () => statusMessages[searchParams.get("message") ?? ""]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(undefined);
    setStatusMessage(undefined);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      setErrorMessage(loginMessages["missing-fields"]);
      setIsSubmitting(false);
      return;
    }

    const result = await loginLocalUser({ email, password });

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    router.replace("/exercises");
    setIsSubmitting(false);
  }

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
            Melde dich mit deiner E-Mail und deinem Passwort an, um deine Übungen zu entdecken.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {errorMessage ? (
              <p className="form-message form-message-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {statusMessage ? (
              <p className="form-message form-message-success">{statusMessage}</p>
            ) : null}

            <label>
              E-Mail-Adresse
              <input name="email" type="email" required placeholder="name@beispiel.ch" />
            </label>

            <label>
              Passwort
              <input name="password" type="password" required placeholder="********" />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? "Anmelden..." : "Anmelden"}
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main>
          <section className="login-page">
            <div className="login-card">
              <p className="subtitle">Lädt...</p>
            </div>
          </section>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
