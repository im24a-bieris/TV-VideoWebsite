"use client";

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutLocalUser, useLocalUser } from "@/lib/auth/client";

export function TopBar() {
  const router = useRouter();
  const user = useLocalUser();

  function handleLogout() {
    logoutLocalUser();
    router.push("/login?message=logged-out");
  }

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-icon">TV</span>
        TV Männedorf
      </Link>
      <nav className="topbar-nav">
        <Link href="/exercises">Übungen</Link>
        {user ? (
          <>
            <Link href="/profile">Profil</Link>
            <button type="button" className="button button-light topbar-logout-button" onClick={handleLogout}>
              Abmelden
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Anmelden</Link>
            <Link href="/register">Registrieren</Link>
          </>
        )}
      </nav>
    </header>
  );
}
