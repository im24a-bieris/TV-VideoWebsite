"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { useLocalUser } from "@/lib/auth/client";

export default function AccountPage() {
  const router = useRouter();
  const user = useLocalUser();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [router, user]);

  if (!user) {
    return (
      <main className="account-page">
        <section className="account-shell">
          <p className="subtitle">Lädt Konto…</p>
        </section>
      </main>
    );
  }

  const [firstName, ...rest] = user.username.split(" ");
  const lastName = rest.join(" ");
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || user.email;

  return (
    <main className="account-page">
      <section className="account-shell">
        <div className="account-header">
          <Link href="/" className="brand">
            <span className="brand-icon">TV</span>
            TV Männedorf
          </Link>

          <LogoutButton />
        </div>

        <div className="account-panel">
          <p className="eyebrow">Konto</p>
          <h1 className="account-title">Willkommen, {displayName}</h1>
          <p className="account-subtitle">
            Du bist angemeldet und kannst jetzt deine Trainingsdaten und gespeicherten Übungen nutzen.
          </p>

          <dl className="account-details">
            <div>
              <dt>E-Mail</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>User-ID</dt>
              <dd>{user.id}</dd>
            </div>
          </dl>

          <div className="account-actions">
            <Link href="/exercises" className="button button-primary">
              Übungen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
