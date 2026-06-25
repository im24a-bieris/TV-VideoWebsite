"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=credentials");
  }

  redirect("/account");
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const passwordConfirm = String(formData.get("passwordConfirm"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));

  if (password !== passwordConfirm) {
    redirect("/register?error=passwords");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      redirect("/register?error=email-exists");
    }

    redirect("/register?error=register");
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    redirect("/register?error=email-exists");
  }

  redirect("/account");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login?message=logged-out");
}
