import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function TopBar() {
  let user: User | null = null;

  if (getSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  }

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-icon">TV</span>
        TV Männedorf
      </Link>
      <nav className="topbar-nav" aria-label="Hauptnavigation">
        <Link href="/exercises">Übungen</Link>
        <Link href="/videos">Videos</Link>
        {user ? (
          <>
            <Link href="/account">Konto</Link>
            <Link href="/upload">Upload</Link>
            <form action={logout}>
              <button type="submit" className="button button-light topbar-logout-button">
                Abmelden
              </button>
            </form>
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
