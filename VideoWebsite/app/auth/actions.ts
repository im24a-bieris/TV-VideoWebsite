"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getErrorRedirect(path: string, error: string) {
  redirect(`${path}?error=${error}`);
}

async function getSupabaseForAction(path: string) {
  try {
    return await createClient();
  } catch (error) {
    console.error("Supabase auth init failed", error);
    getErrorRedirect(path, "config");
  }

  return null as never;
}

export async function login(formData: FormData) {
  const supabase = await getSupabaseForAction("/login");

  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    getErrorRedirect("/login", "missing-fields");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login failed", {
      code: error.code,
      status: error.status,
      message: error.message,
    });

    if (error.message.toLowerCase().includes("not confirmed")) {
      getErrorRedirect("/login", "email-not-confirmed");
    }

    getErrorRedirect("/login", "credentials");
  }

  redirect("/account");
}

export async function register(formData: FormData) {
  const supabase = await getSupabaseForAction("/register");

  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const passwordConfirm = getString(formData, "passwordConfirm");
  const firstName = getString(formData, "firstName");
  const lastName = getString(formData, "lastName");

  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    getErrorRedirect("/register", "missing-fields");
  }

  if (password.length < 8) {
    getErrorRedirect("/register", "password-short");
  }

  if (password !== passwordConfirm) {
    getErrorRedirect("/register", "passwords");
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
    console.error("Supabase registration failed", {
      code: error.code,
      status: error.status,
      message: error.message,
    });

    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      getErrorRedirect("/register", "email-exists");
    }

    if (message.includes("invalid") || message.includes("email")) {
      getErrorRedirect("/register", "invalid");
    }

    if (message.includes("rate limit") || message.includes("too many")) {
      getErrorRedirect("/register", "rate-limit");
    }

    getErrorRedirect("/register", "register");
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    getErrorRedirect("/register", "email-exists");
  }

  if (!data.session) {
    redirect("/login?message=check-email");
  }

  redirect("/account");
}

export async function logout() {
  const supabase = await getSupabaseForAction("/login");

  await supabase.auth.signOut();

  redirect("/login?message=logged-out");
}
