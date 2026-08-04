"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentLocalUser } from "@/lib/auth/client";

export function TopBar() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentLocalUser>>(null);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentLocalUser());
    syncUser();
    window.addEventListener("auth:change", syncUser);
    return () => window.removeEventListener("auth:change", syncUser);
  }, []);

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-icon">TV</span>
        TV Männedorf
      </Link>
      <nav className="topbar-nav">
        <Link href="/exercises">Übungen</Link>
        {user ? <Link href="/profile">Profil</Link> : null}
      </nav>
    </header>
  );
}
