"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateProfile(formData: FormData) {
  const phone = getString(formData, "phone");
  const instagram = getString(formData, "instagram");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.auth.updateUser({
    data: { phone, instagram },
  });

  if (error) {
    console.error("Supabase profile update failed", error);
    redirect("/account?error=profile");
  }

  revalidatePath("/account");
  redirect("/account?message=profile-saved");
}
