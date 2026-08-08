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
    </header>
  );
}
