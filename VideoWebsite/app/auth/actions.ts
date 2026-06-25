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
    redirect("/login?error=login");
  }

  redirect("/exercises");
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

  const { error } = await supabase.auth.signUp({
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
    redirect("/register?error=register");
  }

  redirect("/login?message=check-email");
}
