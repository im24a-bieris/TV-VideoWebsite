"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import "../global.css";
import { registerLocalUser } from "@/lib/auth/client";

const registerMessages: Record<string, string> = {
  passwords: "Die Passwörter stimmen nicht überein.",
  "email-exists": "Diese E-Mail-Adresse ist bereits registriert.",
  register: "Registrierung fehlgeschlagen. Bitte prüfe deine Angaben.",
  "missing-fields": "Bitte fülle alle Felder aus.",
  "password-short": "Das Passwort muss mindestens 8 Zeichen lang sein.",
  invalid: "Bitte gib eine echte E-Mail-Adresse ein.",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    () => registerMessages[searchParams.get("error") ?? ""]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(undefined);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();
    const passwordConfirm = String(formData.get("passwordConfirm") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const username = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      setErrorMessage(registerMessages["missing-fields"]);
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(registerMessages.invalid);
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(registerMessages["password-short"]);
      setIsSubmitting(false);
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage(registerMessages.passwords);
      setIsSubmitting(false);
      return;
    }

    const result = await registerLocalUser({ email, password, username });

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

          <form onSubmit={handleSubmit} className="login-form">
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
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? "Erstelle Konto..." : "Konto erstellen"}
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

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
