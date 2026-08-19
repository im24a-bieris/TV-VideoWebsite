import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export async function TopBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
