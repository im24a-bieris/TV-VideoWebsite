'use client';

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?message=logged-out");
  }

  return (
    <button type="button" onClick={handleLogout} className="button account-logout-button">
      Abmelden
    </button>
  );
}
