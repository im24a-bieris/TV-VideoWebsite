"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import "../global.css";
import { createClient } from "@/lib/supabase/client";

const loginMessages: Record<string, string> = {
  credentials: "E-Mail oder Passwort ist falsch.",
  "missing-fields": "Bitte fülle E-Mail und Passwort aus.",
  config: "Die Anmeldung ist gerade nicht verfügbar. Bitte prüfe die Supabase-Konfiguration.",
};

const statusMessages: Record<string, string> = {
  "logged-out": "Du wurdest abgemeldet.",
  "check-email": "Bitte bestätige deine E-Mail-Adresse über den Link in der E-Mail.",
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

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "").trim().toLowerCase();
      const password = String(formData.get("password") ?? "").trim();

      if (!email || !password) {
        setErrorMessage(loginMessages["missing-fields"]);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(loginMessages.credentials);
        return;
      }

      if (!data.session) {
        setErrorMessage("Die Anmeldung konnte nicht abgeschlossen werden. Bitte versuche es erneut.");
        return;
      }

      router.replace("/account");
    } catch (error) {
      console.error("Supabase login error", error);
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("fetch") || message.includes("network") || message.includes("timed out") || message.includes("dns") || message.includes("resolve")) {
        setErrorMessage("Die Verbindung zum Anmeldedienst ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung oder versuche es später erneut.");
      } else {
        setErrorMessage("Die Anmeldung ist gerade nicht verfügbar. Bitte versuche es später erneut.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
            Melde dich mit deiner E-Mail und deinem Passwort an, um alle Trainingsdaten zu sehen.
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
