import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfigOrThrow } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabaseConfigOrThrow();

  return createBrowserClient(url, anonKey);
}
