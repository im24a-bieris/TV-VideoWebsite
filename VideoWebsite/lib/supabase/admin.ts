import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfigOrThrow, getSupabaseServiceRoleKeyOrThrow } from "./config";

export function createAdminClient() {
  const { url } = getSupabaseConfigOrThrow();
  const serviceRoleKey = getSupabaseServiceRoleKeyOrThrow();

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}