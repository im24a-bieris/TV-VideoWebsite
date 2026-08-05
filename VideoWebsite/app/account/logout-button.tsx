'use client';

import { useRouter } from "next/navigation";
import { logoutLocalUser } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    logoutLocalUser();
    router.push("/login?message=logged-out");
  }

  return (
    <button type="button" onClick={handleLogout} className="button account-logout-button">
      Abmelden
    </button>
  );
}
